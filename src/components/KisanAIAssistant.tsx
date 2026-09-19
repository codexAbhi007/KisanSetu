import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Star,
  Clock,
  ShoppingCart,
  Terminal,
  Layers,
  CheckCircle2,
  Sprout,
  Store,
  RefreshCw,
  HelpCircle,
  Languages,
  Mic,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { kisanAI, PriceComparisonResult } from "../services/kisanAI";
import {
  INDIAN_LANGUAGES,
  DEFAULT_LANGUAGE,
  IndianLanguage,
} from "../config/indianLanguages";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  comparison?: PriceComparisonResult | null;
  timestamp: string;
}

export const KisanAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "terminal">("visual");
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<IndianLanguage>(() => {
    try {
      const saved = localStorage.getItem("kisan-ai-language");
      if (saved)
        return (
          INDIAN_LANGUAGES.find((l) => l.code === saved) || DEFAULT_LANGUAGE
        );
    } catch {
      /* localStorage unavailable */
    }
    return DEFAULT_LANGUAGE;
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "🌾 Namaste! I am Kisan AI, your agricultural price comparison & marketplace advisor connected to live database records.\n\nI can help you:\n• Compare farmer vs shop prices from database inventory\n• Find the cheapest seller & calculate total costs\n• Locate fastest 30-min local delivery vs 1-day farm lots\n• Find highest-rated produce with escrow protection\n\n🎙️ Voice Search: Click the microphone button to speak your query in any Indian language.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    addToCart,
    products,
    mandiPrices,
    setActivePage,
    setSelectedProductId,
    createOrder,
    showToast,
  } = useApp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleLanguageChange = (code: string) => {
    const lang = INDIAN_LANGUAGES.find((l) => l.code === code);
    if (!lang || lang.code === language.code) return;
    setLanguage(lang);
    try {
      localStorage.setItem("kisan-ai-language", lang.code);
    } catch {
      /* localStorage unavailable */
    }
    setMessages((prev) => [
      ...prev,
      {
        id: `lang-${Date.now()}`,
        sender: "ai",
        text: `🌐 Language set to ${lang.native} (${lang.name}).\nYou can now type or speak your questions in ${lang.name} — I will understand and reply in ${lang.native}${lang.scheduled ? ", a Scheduled Language of India" : ""}.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const handleVoiceInput = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      showToast("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) return;

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang =
        language.code === "hi"
          ? "hi-IN"
          : language.code === "bn"
            ? "bn-IN"
            : language.code === "ta"
              ? "ta-IN"
              : language.code === "te"
                ? "te-IN"
                : language.code === "mr"
                  ? "mr-IN"
                  : language.code === "gu"
                    ? "gu-IN"
                    : language.code === "pa"
                      ? "pa-IN"
                      : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        showToast(`🎙️ Listening... Speak now in ${language.name}`);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          showToast(
            "Microphone access denied. Please allow mic permission or open in a new tab.",
          );
        } else {
          showToast(`Microphone error (${event.error}).`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition failed to start:", err);
      setIsListening(false);
      showToast("Could not start microphone.");
    }
  };

  const executeKisanAI = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Send query to server-side Google Gemini backend endpoint along with database products & mandi prices
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: queryText,
          language: {
            code: language.code,
            name: language.name,
            native: language.native,
          },
          context: {
            app: "KisanSetu",
            role: "consumer",
            market: "Nashik-Pune Agri Corridor",
          },
          products,
          mandiPrices,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const localResult = kisanAI.process(queryText, products, mandiPrices);

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: data.reply || localResult.text,
            comparison: localResult.comparison || null,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } else {
        const localResult = kisanAI.process(queryText, products, mandiPrices);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: localResult.text,
            comparison: localResult.comparison || null,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch {
      const localResult = kisanAI.process(queryText, products, mandiPrices);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: localResult.text,
          comparison: localResult.comparison || null,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeKisanAI(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    executeKisanAI(prompt);
  };

  const handleOrderFromAI = (
    sellerName: string,
    productTitle: string,
    qty: number,
    price: number,
  ) => {
    const matched =
      products.find(
        (p) =>
          p.name.toLowerCase().includes(productTitle.toLowerCase()) ||
          p.sellerName.toLowerCase().includes(sellerName.toLowerCase()),
      ) || products[0];

    if (matched) {
      addToCart(matched, qty);
      showToast(
        `Added ${qty} kg ${productTitle} from ${sellerName} (₹${price * qty}) to cart!`,
      );
    } else {
      showToast(`Selected ${qty} kg ${productTitle} from ${sellerName}!`);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-full shadow-xl transition-all transform hover:scale-105 group border border-emerald-500/40 cursor-pointer"
          title="Open Kisan AI Advisory Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs tracking-tight">
            Kisan AI Assistant
          </span>
          <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
        </button>
      )}

      {/* Expanded Assistant Dialog */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-[420px] max-w-[94vw] flex flex-col h-[580px] overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md border border-emerald-400/30">
                <Bot className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm tracking-tight">
                    Kisan AI Engine
                  </h3>
                  <span className="bg-emerald-800/80 text-amber-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                    DB-Sync Online
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200">
                  Voice Recognition • Live Database
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Multilingual Language Selector — All Indian Languages */}
              <div className="relative flex items-center">
                <Languages className="absolute left-2 w-3.5 h-3.5 text-emerald-300 pointer-events-none z-10" />
                <select
                  value={language.code}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="appearance-none bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-[10px] pl-7 pr-5 py-1.5 rounded-xl border border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer max-w-[130px] shadow-sm transition-colors"
                  title="Choose your AI language — every Indian language supported"
                  aria-label="AI response language"
                >
                  <optgroup label="⭐ Scheduled Languages of India">
                    {INDIAN_LANGUAGES.filter((l) => l.scheduled).map((l) => (
                      <option
                        key={l.code}
                        value={l.code}
                        className="bg-slate-900 text-white"
                      >
                        {l.native} — {l.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌐 English · Regional & Tribal Languages">
                    {INDIAN_LANGUAGES.filter((l) => !l.scheduled).map((l) => (
                      <option
                        key={l.code}
                        value={l.code}
                        className="bg-slate-900 text-white"
                      >
                        {l.native} — {l.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: "welcome-reset",
                      sender: "ai",
                      text: "Kisan AI reset. Ready to compare prices from live database catalog.",
                      timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    },
                  ]);
                }}
                className="p-1.5 rounded-xl hover:bg-emerald-800 text-emerald-300 transition-colors"
                title="Reset Chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-emerald-800 text-emerald-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-emerald-50/80 dark:bg-slate-800/80 px-3 py-2 border-b border-emerald-100 dark:border-slate-700 flex gap-2 overflow-x-auto text-[11px] font-medium scrollbar-none items-center">
            <button
              onClick={() => handleQuickPrompt("Compare tomato prices")}
              className="bg-white dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-slate-700 whitespace-nowrap shadow-xs flex items-center gap-1.5 transition-colors font-bold cursor-pointer"
            >
              <span>🍅</span>
              <span>Compare tomato prices</span>
            </button>
            <button
              onClick={() =>
                handleQuickPrompt("Find 10 kg tomatoes at the best price")
              }
              className="bg-white dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-slate-700 whitespace-nowrap shadow-xs flex items-center gap-1.5 transition-colors font-bold cursor-pointer"
            >
              <span>💰</span>
              <span>10 kg tomatoes (best price)</span>
            </button>
            <button
              onClick={() =>
                handleQuickPrompt("Where can I buy 5 kg potatoes?")
              }
              className="bg-white dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-slate-700 whitespace-nowrap shadow-xs flex items-center gap-1.5 transition-colors font-bold cursor-pointer"
            >
              <span>🥔</span>
              <span>5 kg potatoes</span>
            </button>
            <button
              onClick={() => handleQuickPrompt("Compare onion prices")}
              className="bg-white dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-slate-700 whitespace-nowrap shadow-xs flex items-center gap-1.5 transition-colors font-bold cursor-pointer"
            >
              <span>🧅</span>
              <span>Compare onions</span>
            </button>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-slate-950/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4 text-emerald-200" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] space-y-2.5 ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {/* Standard Text Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-emerald-700 text-white rounded-br-none shadow-md font-medium"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-slate-700 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Rich Comparison Result Card */}
                  {msg.comparison && (
                    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-md p-4 space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-slate-900 dark:text-white">
                            {msg.comparison.product}
                          </span>
                          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold">
                            {msg.comparison.quantity} kg
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-[10px] font-mono">
                          <button
                            onClick={() => setActiveTab("visual")}
                            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                              activeTab === "visual"
                                ? "bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            Visual
                          </button>
                          <button
                            onClick={() => setActiveTab("terminal")}
                            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                              activeTab === "terminal"
                                ? "bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            Console
                          </button>
                        </div>
                      </div>

                      {/* Visual Comparison View */}
                      {activeTab === "visual" ? (
                        <div className="space-y-3">
                          {/* Sellers List */}
                          <div className="space-y-2">
                            {msg.comparison.availableSellers.map(
                              (seller, idx) => {
                                const isFarmer = seller.type === "Farmer";
                                return (
                                  <div
                                    key={idx}
                                    className={`p-3 rounded-xl border transition-all ${
                                      seller.isCheapest
                                        ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-300 dark:ring-emerald-700"
                                        : seller.isFastest
                                          ? "bg-sky-50/70 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700"
                                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                                            {seller.seller}
                                          </span>
                                          <span
                                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                                              isFarmer
                                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                                                : "bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300"
                                            }`}
                                          >
                                            {isFarmer ? (
                                              <Sprout className="w-2.5 h-2.5" />
                                            ) : (
                                              <Store className="w-2.5 h-2.5" />
                                            )}
                                            {seller.type}
                                          </span>
                                          {seller.isCheapest && (
                                            <span className="bg-emerald-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                                              💰 Best Price
                                            </span>
                                          )}
                                          {seller.isFastest && (
                                            <span className="bg-sky-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                                              ⚡ Fastest
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
                                          <span>
                                            Rate:{" "}
                                            <strong className="text-slate-900 dark:text-white">
                                              ₹{seller.price}/kg
                                            </strong>
                                          </span>
                                          <span>•</span>
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-400" />
                                            {seller.deliveryFormatted}
                                          </span>
                                          <span>•</span>
                                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                                            <Star className="w-3 h-3 fill-current" />
                                            {seller.rating}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="text-right shrink-0">
                                        <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                                          ₹{seller.total}
                                        </div>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                          for {msg.comparison?.quantity}kg
                                        </span>
                                      </div>
                                    </div>

                                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                        Stock: {seller.stock} kg
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleOrderFromAI(
                                            seller.seller,
                                            msg.comparison!.product,
                                            msg.comparison!.quantity,
                                            seller.price,
                                          )
                                        }
                                        className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                                      >
                                        <ShoppingCart className="w-3 h-3" />
                                        <span>Select & Order</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>

                          {/* AI Recommendation Summary Box */}
                          <div className="bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-950/40 border border-amber-200/80 dark:border-slate-700 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-extrabold text-xs">
                              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span>🤖 Kisan AI Recommendation (DB Sync)</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1">
                              <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-amber-100 dark:border-slate-700">
                                <span className="text-slate-500 dark:text-slate-400 block text-[9px]">
                                  💰 BEST PRICE
                                </span>
                                <strong className="text-slate-900 dark:text-white block truncate">
                                  {msg.comparison.cheapest.seller}
                                </strong>
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                                  ₹{msg.comparison.cheapest.price}/kg
                                </span>
                              </div>
                              <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-amber-100 dark:border-slate-700">
                                <span className="text-slate-500 dark:text-slate-400 block text-[9px]">
                                  🚚 FASTEST
                                </span>
                                <strong className="text-slate-900 dark:text-white block truncate">
                                  {msg.comparison.fastest.seller}
                                </strong>
                                <span className="text-sky-700 dark:text-sky-400 font-bold">
                                  {msg.comparison.fastest.deliveryFormatted}
                                </span>
                              </div>
                              <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-amber-100 dark:border-slate-700">
                                <span className="text-slate-500 dark:text-slate-400 block text-[9px]">
                                  ⭐ BEST RATED
                                </span>
                                <strong className="text-slate-900 dark:text-white block truncate">
                                  {msg.comparison.bestRated.seller}
                                </strong>
                                <span className="text-amber-600 dark:text-amber-400 font-bold">
                                  {msg.comparison.bestRated.rating} ★
                                </span>
                              </div>
                            </div>

                            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium pt-1 leading-relaxed">
                              {msg.comparison.aiRecommendation}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Terminal Console View matching Python kisan_ai.py output */
                        <div className="bg-slate-950 text-emerald-400 font-mono text-[10px] p-3 rounded-xl overflow-x-auto whitespace-pre leading-relaxed border border-slate-800 shadow-inner">
                          {msg.comparison.formattedTerminalText}
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono px-1 block">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit shadow-xs animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium">
                  Kisan AI is analyzing live database records & logistics...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input form with Microphone Voice Button */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center ${
                isListening
                  ? "bg-red-600 text-white animate-pulse ring-2 ring-red-400"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
              title={
                isListening
                  ? "Listening... Click to stop"
                  : "Click to speak in your language (Web Speech API)"
              }
            >
              <Mic
                className={`w-4 h-4 ${isListening ? "animate-bounce text-white" : ""}`}
              />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask in ${language.native} — e.g. टमाटर के दाम बताओ...`}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
