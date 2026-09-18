import { Product } from '../types';
import { MandiPriceRecord } from './firebaseDb';

/**
 * KisanAI - Agricultural Supply-Chain & Price Comparison Engine
 * Direct TypeScript implementation of the Python kisan_ai.py specification,
 * now dynamically synchronized with live database products and mandi prices.
 */

export interface SellerQuote {
  seller: string;
  type: 'Farmer' | 'Shopkeeper';
  price: number; // ₹ per kg
  stock: number; // in kg
  delivery: number; // in minutes
  rating: number;
}

export interface SellerComparisonItem extends SellerQuote {
  total: number;
  deliveryFormatted: string;
  isCheapest: boolean;
  isFastest: boolean;
  isBestRated: boolean;
}

export interface PriceComparisonResult {
  product: string;
  quantity: number;
  availableSellers: SellerComparisonItem[];
  cheapest: SellerComparisonItem;
  fastest: SellerComparisonItem;
  bestRated: SellerComparisonItem;
  recommendationType: 'single_best' | 'split_choice';
  aiRecommendation: string;
  formattedTerminalText: string;
}

export interface ProcessResult {
  text: string;
  comparison: PriceComparisonResult | null;
  productFound?: string | null;
  quantityFound?: number;
}

export class KisanAI {
  public products: Record<string, SellerQuote[]>;

  constructor() {
    // Initial marketplace database
    this.products = {
      tomato: [
        {
          seller: 'Patil Agri Farm',
          type: 'Farmer',
          price: 28,
          stock: 1000,
          delivery: 1440,
          rating: 4.8,
        },
        {
          seller: 'Green Valley Farm',
          type: 'Farmer',
          price: 30,
          stock: 500,
          delivery: 2880,
          rating: 4.6,
        },
        {
          seller: 'Sharma Fresh Mart',
          type: 'Shopkeeper',
          price: 34,
          stock: 120,
          delivery: 30,
          rating: 4.7,
        },
        {
          seller: 'Fresh Basket',
          type: 'Shopkeeper',
          price: 32,
          stock: 80,
          delivery: 45,
          rating: 4.5,
        },
      ],
      potato: [
        {
          seller: 'Suresh Farm',
          type: 'Farmer',
          price: 24,
          stock: 900,
          delivery: 1440,
          rating: 4.7,
        },
        {
          seller: 'City Fresh',
          type: 'Shopkeeper',
          price: 29,
          stock: 150,
          delivery: 40,
          rating: 4.6,
        },
      ],
      onion: [
        {
          seller: 'Green Farms',
          type: 'Farmer',
          price: 27,
          stock: 800,
          delivery: 1200,
          rating: 4.8,
        },
        {
          seller: 'Daily Needs',
          type: 'Shopkeeper',
          price: 31,
          stock: 200,
          delivery: 35,
          rating: 4.5,
        },
      ],
      mango: [
        {
          seller: 'Konkan Mango Growers',
          type: 'Farmer',
          price: 140,
          stock: 1200,
          delivery: 1440,
          rating: 5.0,
        },
        {
          seller: 'Sharma Fresh Mart',
          type: 'Shopkeeper',
          price: 165,
          stock: 60,
          delivery: 30,
          rating: 4.8,
        },
      ],
      rice: [
        {
          seller: 'Punjab Kisan Vikas FPO',
          type: 'Farmer',
          price: 72,
          stock: 5000,
          delivery: 2880,
          rating: 4.9,
        },
        {
          seller: 'Sharma Fresh Mart',
          type: 'Shopkeeper',
          price: 85,
          stock: 300,
          delivery: 40,
          rating: 4.7,
        },
      ],
    };
  }

  public updateFromDatabase(liveProducts?: Product[], liveMandiPrices?: MandiPriceRecord[]) {
    if (liveProducts && liveProducts.length > 0) {
      const grouped: Record<string, SellerQuote[]> = {};
      for (const p of liveProducts) {
        const nameLower = p.name.toLowerCase();
        const key = nameLower.includes('tomato') ? 'tomato'
          : nameLower.includes('potato') ? 'potato'
          : nameLower.includes('onion') ? 'onion'
          : nameLower.includes('mango') ? 'mango'
          : nameLower.includes('rice') ? 'rice'
          : nameLower.includes('wheat') ? 'wheat'
          : nameLower.includes('apple') ? 'apple'
          : nameLower.includes('banana') ? 'banana'
          : nameLower.replace(/[^a-z0-9]/g, '_');

        if (!grouped[key]) grouped[key] = [];
        const exists = grouped[key].some((s) => s.seller === p.sellerName);
        if (!exists) {
          grouped[key].push({
            seller: p.sellerName || 'FPO Farmer',
            type: p.sellerType === 'shopkeeper' ? 'Shopkeeper' : 'Farmer',
            price: p.pricePerKg || 30,
            stock: p.quantityAvailableKg || 100,
            delivery: p.sellerType === 'shopkeeper' ? 35 : 1440,
            rating: p.rating || 4.7,
          });
        }
      }
      this.products = { ...this.products, ...grouped };
    }

    if (liveMandiPrices && liveMandiPrices.length > 0) {
      for (const m of liveMandiPrices) {
        const commLower = (m.commodity || '').toLowerCase();
        const key = commLower.includes('tomato') ? 'tomato'
          : commLower.includes('potato') ? 'potato'
          : commLower.includes('onion') ? 'onion'
          : commLower.replace(/[^a-z0-9]/g, '_');
        if (!this.products[key]) this.products[key] = [];
        const exists = this.products[key].some((s) => s.seller.includes(m.mandi));
        if (!exists) {
          this.products[key].push({
            seller: `${m.mandi} Mandi (${m.state})`,
            type: 'Farmer',
            price: m.modalPrice,
            stock: 2000,
            delivery: 1200,
            rating: 4.8,
          });
        }
      }
    }
  }

  // -----------------------------------------
  // FIND PRODUCT
  // -----------------------------------------
  public findProduct(query: string): string | null {
    const queryLower = query.toLowerCase();

    for (const product of Object.keys(this.products)) {
      if (
        queryLower.includes(product) ||
        (product === 'tomato' && queryLower.includes('tomatoes')) ||
        (product === 'potato' && queryLower.includes('potatoes')) ||
        (product === 'onion' && queryLower.includes('onions')) ||
        (product === 'mango' && queryLower.includes('mangoes'))
      ) {
        return product;
      }
    }

    return null;
  }

  // -----------------------------------------
  // GET QUANTITY
  // -----------------------------------------
  public getQuantity(query: string): number {
    const words = query.toLowerCase().split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const cleanWord = words[i].replace(/[^\d.]/g, '');
      const parsedNum = parseFloat(cleanWord);

      if (!isNaN(parsedNum) && parsedNum > 0) {
        if (words[i].includes('kg')) {
          return parsedNum;
        }
        if (i + 1 < words.length) {
          const unit = words[i + 1].toLowerCase();
          if (['kg', 'kgs', 'kilogram', 'kilograms', 'kilo', 'kilos'].includes(unit)) {
            return parsedNum;
          }
        }
        return parsedNum;
      }
    }

    return 1;
  }

  // -----------------------------------------
  // PRICE COMPARISON
  // -----------------------------------------
  public comparePrices(product: string, quantity: number = 1): PriceComparisonResult | string {
    const sellers = this.products[product.toLowerCase()];

    if (!sellers) {
      return `Product "${product}" not found in database.`;
    }

    const available = sellers.filter((seller) => seller.stock >= quantity);

    if (available.length === 0) {
      return 'Sorry, no seller has enough stock for ' + quantity + ' kg.';
    }

    // Lowest price
    const cheapestRaw = available.reduce((min, cur) => (cur.price < min.price ? cur : min), available[0]);

    // Fastest delivery
    const fastestRaw = available.reduce((min, cur) => (cur.delivery < min.delivery ? cur : min), available[0]);

    // Highest rated
    const bestRatedRaw = available.reduce((max, cur) => (cur.rating > max.rating ? cur : max), available[0]);

    const formattedSellers: SellerComparisonItem[] = [...available]
      .sort((a, b) => a.price - b.price)
      .map((s) => {
        const total = s.price * quantity;
        const deliveryFormatted =
          s.delivery < 60 ? `${s.delivery} minutes` : `${Math.floor(s.delivery / 1440)} day(s)`;

        return {
          ...s,
          total,
          deliveryFormatted,
          isCheapest: s.seller === cheapestRaw.seller,
          isFastest: s.seller === fastestRaw.seller,
          isBestRated: s.seller === bestRatedRaw.seller,
        };
      });

    const cheapest = formattedSellers.find((s) => s.seller === cheapestRaw.seller)!;
    const fastest = formattedSellers.find((s) => s.seller === fastestRaw.seller)!;
    const bestRated = formattedSellers.find((s) => s.seller === bestRatedRaw.seller)!;

    const isSingleBest = cheapest.seller === fastest.seller;
    const aiRecommendation = isSingleBest
      ? `🏆 AI RECOMMENDATION (Database Synchronized): ${cheapest.seller} offers the best overall option with lowest price (₹${cheapest.price}/kg) and fastest delivery (${cheapest.deliveryFormatted}).`
      : `🏆 AI RECOMMENDATION (Database Synchronized):\n• Choose ${cheapest.seller} (${cheapest.type}) for the lowest price (₹${cheapest.price}/kg, Total: ₹${cheapest.total}).\n• Choose ${fastest.seller} (${fastest.type}) if you need rapid delivery (${fastest.deliveryFormatted}).`;

    // Construct formatted terminal string matching the Python output
    let terminalOutput = `============================================================\n`;
    terminalOutput += `           KISAN AI PRICE COMPARISON (DB SYNC)\n`;
    terminalOutput += `============================================================\n\n`;
    terminalOutput += `Product: ${product.charAt(0).toUpperCase() + product.slice(1)}\n`;
    terminalOutput += `Quantity: ${quantity} kg\n\n`;
    terminalOutput += `------------------------------------------------------------\n`;

    for (const seller of formattedSellers) {
      terminalOutput += `${seller.seller} (${seller.type})\n`;
      terminalOutput += `Price: ₹${seller.price}/kg\n`;
      terminalOutput += `Total: ₹${seller.total}\n`;
      terminalOutput += `Delivery: ${seller.deliveryFormatted}\n`;
      terminalOutput += `Rating: ⭐ ${seller.rating}\n`;
      terminalOutput += `------------------------------------------------------------\n`;
    }

    terminalOutput += `\n🤖 KISAN AI RECOMMENDATION\n\n`;
    terminalOutput += `💰 BEST PRICE:\n${cheapest.seller}\n₹${cheapest.price}/kg\nTotal: ₹${cheapest.total}\n\n`;
    terminalOutput += `🚚 FASTEST DELIVERY:\n${fastest.seller}\n₹${fastest.price}/kg\nDelivery: ${fastest.deliveryFormatted}\n\n`;
    terminalOutput += `⭐ BEST RATED:\n${bestRated.seller}\nRating: ⭐ ${bestRated.rating}\n\n`;
    terminalOutput += isSingleBest
      ? `🏆 AI RECOMMENDATION:\n${cheapest.seller} offers the best overall option.`
      : `🏆 AI RECOMMENDATION:\nChoose ${cheapest.seller} for the lowest price.\nChoose ${fastest.seller} if you need faster delivery.`;

    return {
      product: product.charAt(0).toUpperCase() + product.slice(1),
      quantity,
      availableSellers: formattedSellers,
      cheapest,
      fastest,
      bestRated,
      recommendationType: isSingleBest ? 'single_best' : 'split_choice',
      aiRecommendation,
      formattedTerminalText: terminalOutput,
    };
  }

  // -----------------------------------------
  // CHAT PROCESSOR
  // -----------------------------------------
  public process(query: string, liveProducts?: Product[], liveMandiPrices?: MandiPriceRecord[]): ProcessResult {
    this.updateFromDatabase(liveProducts, liveMandiPrices);
    const queryLower = query.toLowerCase();
    const product = this.findProduct(queryLower);

    if (!product) {
      return {
        text: `I couldn't find that product in the live marketplace database.\nAvailable products: ${Object.keys(this.products).join(', ')}.`,
        comparison: null,
      };
    }

    const quantity = this.getQuantity(queryLower);

    const isComparisonIntent = [
      'price',
      'cheap',
      'cheapest',
      'compare',
      'best',
      'buy',
      'cost',
      'rate',
      'delivery',
      'shop',
      'farmer',
      'seller',
      'order',
    ].some((kw) => queryLower.includes(kw));

    if (isComparisonIntent || queryLower.includes('kg') || queryLower.includes('kilo')) {
      const result = this.comparePrices(product, quantity);

      if (typeof result === 'string') {
        return {
          text: result,
          comparison: null,
          productFound: product,
          quantityFound: quantity,
        };
      }

      return {
        text: `Here is the comprehensive Kisan AI Price Comparison (Database Synchronized) for ${quantity} kg of ${product.toUpperCase()}:`,
        comparison: result,
        productFound: product,
        quantityFound: quantity,
      };
    }

    return {
      text: `I found ${product.charAt(0).toUpperCase() + product.slice(1)} in the database.\nAsk me to "compare ${product} prices" or "find ${quantity > 1 ? quantity : 10} kg ${product} at the best price".`,
      comparison: null,
      productFound: product,
      quantityFound: quantity,
    };
  }
}

// Export singleton instance for immediate application use
export const kisanAI = new KisanAI();
