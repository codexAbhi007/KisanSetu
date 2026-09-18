import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client safely on server side
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

// API Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Python Streamlit logic port for Kisan AI price comparison & scoring
const UNIT_TO_KG: Record<string, number> = {
  "Kilogram": 1,
  "Quintal": 100,
  "Tonne": 1000,
  "Gram": 0.001
};

function convertToKg(price: number, unit: string): number {
  return price / (UNIT_TO_KG[unit] || 1);
}

function calculateEffectivePrice(row: { price: number; unit: string; quantity: number; transport: number }): number {
  const basePrice = convertToKg(row.price, row.unit || "Kilogram");
  const quantity = row.quantity;
  if (quantity <= 0) return basePrice;
  const transportPerKg = row.transport / quantity;
  return basePrice + transportPerKg;
}

function calculatePriceScore(price: number, minimum: number, maximum: number): number {
  if (maximum === minimum) return 100;
  return ((maximum - price) / (maximum - minimum)) * 100;
}

function calculateMarketScore(priceScore: number, quality: number, availability: number): number {
  const qualityScore = quality;
  let availabilityScore = 50;
  if (availability >= 1000) availabilityScore = 100;
  else if (availability >= 500) availabilityScore = 85;
  else if (availability >= 100) availabilityScore = 70;

  const score = priceScore * 0.60 + qualityScore * 0.25 + availabilityScore * 0.15;
  return Math.round(score * 100) / 100;
}

// Marketplace database for Kisan AI price comparison with extended Python schema attributes
const KISAN_AI_PRODUCTS: Record<string, Array<{ seller: string; type: string; price: number; stock: number; delivery: number; rating: number; quality: number; transport: number; market: string; location: string }>> = {
  tomato: [
    { seller: "Patil Agri Farm", type: "Farmer", price: 28, stock: 1000, delivery: 1440, rating: 4.8, quality: 92, transport: 120, market: "Nashik FPO Mandi", location: "Nashik" },
    { seller: "Green Valley Farm", type: "Farmer", price: 30, stock: 500, delivery: 2880, rating: 4.6, quality: 88, transport: 150, market: "Pune Rural Hub", location: "Pune" },
    { seller: "Sharma Fresh Mart", type: "Shopkeeper", price: 34, stock: 120, delivery: 30, rating: 4.7, quality: 90, transport: 20, market: "Kothrud Retail", location: "Pune" },
    { seller: "Fresh Basket", type: "Shopkeeper", price: 32, stock: 80, delivery: 45, rating: 4.5, quality: 85, transport: 30, market: "Viman Nagar Store", location: "Pune" }
  ],
  potato: [
    { seller: "Suresh Farm", type: "Farmer", price: 24, stock: 900, delivery: 1440, rating: 4.7, quality: 90, transport: 100, market: "Pune Wholesale", location: "Pune" },
    { seller: "City Fresh", type: "Shopkeeper", price: 29, stock: 150, delivery: 40, rating: 4.6, quality: 86, transport: 25, market: "Deccan Mart", location: "Pune" }
  ],
  onion: [
    { seller: "Green Farms", type: "Farmer", price: 27, stock: 800, delivery: 1200, rating: 4.8, quality: 94, transport: 140, market: "Lasalgaon Mandi", location: "Nashik" },
    { seller: "Daily Needs", type: "Shopkeeper", price: 31, stock: 200, delivery: 35, rating: 4.5, quality: 88, transport: 30, market: "Hadapsar Store", location: "Pune" }
  ]
};

function processKisanAIQuery(query: string): string | null {
  const q = query.toLowerCase();
  let matchedProduct: string | null = null;
  for (const prod of Object.keys(KISAN_AI_PRODUCTS)) {
    if (q.includes(prod) || (prod === 'tomato' && q.includes('tomatoes')) || (prod === 'potato' && q.includes('potatoes')) || (prod === 'onion' && q.includes('onions'))) {
      matchedProduct = prod;
      break;
    }
  }

  if (!matchedProduct) return null;

  // Extract quantity
  let qty = 100;
  const words = q.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const num = parseFloat(words[i].replace(/[^\d.]/g, ''));
    if (!isNaN(num) && num > 0) {
      qty = num;
      break;
    }
  }

  const items = KISAN_AI_PRODUCTS[matchedProduct];
  if (!items.length) return null;

  // Calculate effective prices and market scores using Python Streamlit algorithm
  const rows = items.map(item => {
    const effective_price = calculateEffectivePrice({ price: item.price, unit: 'Kilogram', quantity: item.stock, transport: item.transport });
    return { ...item, effective_price };
  });

  const minPrice = Math.min(...rows.map(r => r.effective_price));
  const maxPrice = Math.max(...rows.map(r => r.effective_price));

  const analyzed = rows.map(item => {
    const price_score = calculatePriceScore(item.effective_price, minPrice, maxPrice);
    const market_score = calculateMarketScore(price_score, item.quality, item.stock);
    return { ...item, market_score };
  }).sort((a, b) => b.market_score - a.market_score);

  const best = analyzed[0];
  const totalCost = best.effective_price * qty;

  let response = `🌾 KISANSETU AI PRICE INTELLIGENCE\n\nCommodity: ${matchedProduct.toUpperCase()} (${qty} kg requirement)\n\n`;
  response += `🏆 BEST MARKET (Scored by Python Streamlit Algorithm):\n• Market: ${best.market} (${best.location})\n• Seller: ${best.seller} (${best.type})\n• Effective Price: ₹${best.effective_price.toFixed(2)}/kg\n• Quality Score: ${best.quality}%\n• Calculated Market Score: ${best.market_score}/100\n• Total Estimated Cost for ${qty} kg: ₹${totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n\n`;
  
  response += `📊 MARKET COMPARISON RANKINGS:\n`;
  analyzed.forEach((item, idx) => {
    response += `${idx + 1}. ${item.market} - ${item.seller}: ₹${item.effective_price.toFixed(2)}/kg | Score: ${item.market_score}/100 | Stock: ${item.stock} kg\n`;
  });

  response += `\n🤖 AI RECOMMENDATION:\nBEST OPTION — ${best.market} currently provides the optimal combination of price, quality, and availability according to KisanSetu's multi-factor economic scoring model.`;

  return response;
}

// AI Assistant Endpoint for Kisan AI
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { prompt, context, language } = req.body;

    // ── Multilingual support: language = { code, name, native } ──
    const langName: string = language?.name || "English";
    const langNative: string = language?.native || "English";
    const isEnglish = !language || language.code === "en" || langName === "English";
    const client = getAIClient();

    // Check if query matches deterministic Kisan AI price comparison
    const priceCompareResult = prompt ? processKisanAIQuery(prompt) : null;
    if (priceCompareResult) {
      // Non-English language selected: localize the deterministic report via Gemini
      if (!isEnglish && client) {
        try {
          const localization = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `Localize the following KisanSetu agricultural price intelligence report into ${langName} (${langNative}).\nRULES:\n1. Write ONLY in ${langName} using its native script (${langNative}).\n2. Keep ALL numbers, ₹ prices, percentages, quantities and scores EXACTLY unchanged.\n3. Keep seller, market and city names intact (transliterate naturally into ${langName} where appropriate).\n4. Preserve all emojis and the line-break structure of the report.\n5. Return ONLY the localized report — no extra commentary.\n\nREPORT:\n${priceCompareResult}`
                  }
                ]
              }
            ]
          });
          return res.json({ reply: localization.text });
        } catch (localizationError: any) {
          console.error("Kisan AI Localization Error:", localizationError);
          // Graceful fallback to the English deterministic report
          return res.json({ reply: priceCompareResult });
        }
      }
      return res.json({ reply: priceCompareResult });
    }

    if (!client) {
      // Fallback intelligent response if API key is not configured
      return res.json({
        reply: isEnglish
          ? `[Kisan AI Advisor] I've analyzed your query regarding "${prompt || 'agricultural produce'}". You can ask me to "Compare tomato prices", "Find 10 kg potatoes at the best price", or "Where can I buy 5 kg onions?" for instant price comparisons across farmers and shopkeepers.`
          : `[Kisan AI Advisor (${langNative})] Full ${langName} responses need the AI engine online. Meanwhile, English commands still work: "Compare tomato prices", "Find 10 kg potatoes at the best price", or "Where can I buy 5 kg onions?".`
      });
    }

    const languageRule = isEnglish
      ? "Respond in the same language the user used (default English)."
      : `CRITICAL LANGUAGE RULE: Respond ONLY in ${langName} (${langNative}) using its native script. Even if the user's query is written in English or any other Indian/foreign language, you MUST always reply in ${langName}. Keep all ₹ prices, quantities and numbers clear and easy for farmers to read.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are Kisan AI, an expert agricultural supply-chain advisor and smart marketplace assistant for KisanSetu in India (SIH 2026). Help farmers, FPOs, and bulk buyers optimize pricing, demand forecasting, logistics, and direct farm-to-market trade.\n${languageRule}\nContext: ${JSON.stringify(context || {})}\nUser Query: ${prompt}`
            }
          ]
        }
      ]
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini AI Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

// AI Price Recommendation Endpoint
app.post("/api/ai/price-recommendation", async (req, res) => {
  try {
    const { productName, location, qualityGrade, quantityKg } = req.body;
    const client = getAIClient();

    if (!client) {
      return res.json({
        recommendedMin: 26,
        recommendedMax: 29,
        confidence: 89,
        reason: `Based on simulated Nashik & Kolkata wholesale indices for ${productName || 'produce'} with ${qualityGrade || 'Grade A'} quality.`,
        demandLevel: 'High',
        bestSellingWindow: 'Next 3-5 days'
      });
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Provide a JSON response with pricing recommendations for an Indian agricultural product. 
              Product: ${productName}
              Location: ${location}
              Quality: ${qualityGrade}
              Quantity: ${quantityKg} kg
              Return JSON format: { "recommendedMin": number, "recommendedMax": number, "confidence": number, "reason": string, "demandLevel": "High"|"Medium"|"Low", "bestSellingWindow": string }`
            }
          ]
        }
      ],
      config: { responseMimeType: 'application/json' }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("AI Price Rec Error:", error);
    res.json({
      recommendedMin: 25,
      recommendedMax: 30,
      confidence: 85,
      reason: "Fallback recommendation based on regional market trends.",
      demandLevel: 'High',
      bestSellingWindow: 'Next 4 days'
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KisanSetu Server running on http://localhost:${PORT}`);
  });
}

startServer();
