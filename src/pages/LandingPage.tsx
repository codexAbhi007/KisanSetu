import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Zap,
  Clock,
  Star,
  ShieldCheck,
  Boxes,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  TrendingUp,
  Percent,
  Sprout,
  Award,
} from 'lucide-react';
import { kisanAI, PriceComparisonResult } from '../services/kisanAI';

export const LandingPage: React.FC = () => {
  const {
    products,
    setActivePage,
    setSelectedProductId,
    addToCart,
    cart,
    updateCartQuantity,
    removeFromCart,
    addToWishlist,
    wishlist,
    showToast,
  } = useApp();

  // Banner carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPackWeight, setSelectedPackWeight] = useState<Record<string, number>>({});
  const [aiCompareProduce, setAiCompareProduce] = useState('tomato');
  const [aiCompareQty, setAiCompareQty] = useState(5);
  const [compareResult, setCompareResult] = useState<PriceComparisonResult | null>(null);

  // Farmer revenue calculator state
  const [calcMonthlyKg, setCalcMonthlyKg] = useState(1500);
  const traditionalEarnings = calcMonthlyKg * 18;
  const kisanSetuEarnings = calcMonthlyKg * 27;
  const netSurplus = kisanSetuEarnings - traditionalEarnings;

  const promoBanners = [
    {
      id: 1,
      badge: 'FARM TO FORK MAHOTSAV',
      headline: 'Farm-Fresh Harvest Festival',
      subheadline: 'Up to 35% OFF on Nashik Tomatoes, Nagpur Oranges & Organic Grains',
      tag: '100% Direct from 500+ Verified FPOs',
      cta: 'Shop Fresh Harvest',
      bgGradient: 'from-[#064e3b] via-[#047857] to-[#0f766e]',
      accentColor: '#10b981',
      image:
        'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 2,
      badge: '⚡ 30-MINUTE KIRANA EXPRESS',
      headline: 'Instant Neighborhood Delivery',
      subheadline: 'Daily cooking veggies, milk & staples delivered in 30 minutes from local stores',
      tag: 'Guaranteed 30-Min Delivery Slot',
      cta: 'Explore 30-Min Mart',
      bgGradient: 'from-[#7c2d12] via-[#c2410c] to-[#ea580c]',
      accentColor: '#fbbf24',
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 3,
      badge: '🌾 B2B BULK MANDI SOURCING',
      headline: 'Wholesale Lots (100kg to 10 Ton)',
      subheadline: 'For Restaurants, Supermarkets, Hostels & Retailers with Escrow Protection',
      tag: 'Volume Tier Pricing • Direct Farmer Link',
      cta: 'Browse Bulk Lots',
      bgGradient: 'from-[#0f2d4a] via-[#1e3a5f] to-[#1e40af]',
      accentColor: '#38bdf8',
      image:
        'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promoBanners.length]);

  // Run initial AI comparison
  useEffect(() => {
    const res = kisanAI.comparePrices(aiCompareProduce, aiCompareQty);
    if (typeof res !== 'string') {
      setCompareResult(res);
    }
  }, [aiCompareProduce, aiCompareQty]);

  // Helper to get cart quantity for a specific product
  const getProductCartQty = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    return item ? item.quantityKg : 0;
  };

  const handleWeightChange = (productId: string, weightKg: number) => {
    setSelectedPackWeight((prev) => ({ ...prev, [productId]: weightKg }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16 transition-colors">
      {/* 1. MEGA HERO CAROUSEL & PROMO WALL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Rotating Banner */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-lg h-[340px] sm:h-[380px] bg-slate-900 group">
            {promoBanners.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
                  idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background image with gradient overlay */}
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-90`} />

                {/* Content */}
                <div className="relative z-20 p-6 sm:p-10 max-w-xl space-y-3.5 text-white">
                  <div className="inline-flex items-center gap-2 bg-black/40 border border-white/20 px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{slide.badge}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    {slide.headline}
                  </h1>

                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
                    {slide.subheadline}
                  </p>

                  <div className="text-[11px] text-amber-200 font-mono flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{slide.tag}</span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        setActivePage(
                          idx === 2 ? 'bulk_marketplace' : idx === 1 ? 'consumer_home' : 'marketplace'
                        )
                      }
                      className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                    >
                      <span>{slide.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider arrows */}
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev === 0 ? promoBanners.length - 1 : prev - 1))
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % promoBanners.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicator dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {promoBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    i === currentSlide ? 'bg-emerald-400 w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Side Promo Mini-Banners */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Promo Card 1: Farm Fresh Organic */}
            <div
              onClick={() => setActivePage('marketplace')}
              className="flex-1 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/40 dark:to-teal-900/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1.5">
                <span className="bg-emerald-700 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xs">
                  Kisan Organic
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  100% GAP Certified Vegetables
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Zero residue, harvested this morning.</p>
                <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 group-hover:underline flex items-center gap-1">
                  <span>Shop Organic</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-xs shrink-0 ml-3">
                <img
                  src="https://images.unsplash.com/photo-1597362078696-6e4ff682d2c1?auto=format&fit=crop&w=300&q=80"
                  alt="Organic"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
            </div>

            {/* Promo Card 2: 30-Min Kirana Express */}
            <div
              onClick={() => setActivePage('consumer_home')}
              className="flex-1 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-900/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1.5">
                <span className="bg-amber-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xs">
                  ⚡ Kisan Express Instant
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Fast 30-Min Local Kirana Delivery
                </h3>
                <p className="text-[11px] text-slate-700 dark:text-slate-400">From verified neighborhood grocers.</p>
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 group-hover:underline flex items-center gap-1">
                  <span>Order Express</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-xs shrink-0 ml-3">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"
                  alt="Express"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CIRCULAR CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Shop by Category</span>
              <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                • 2,000+ Farm Produce & Pantry Staples
              </span>
            </h2>
            <button
              onClick={() => setActivePage('marketplace')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
            {[
              {
                title: 'Fresh Veggies',
                badge: 'Daily',
                img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80',
                action: 'marketplace',
              },
              {
                title: 'Fresh Fruits',
                badge: 'Sweet',
                img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80',
                action: 'marketplace',
              },
              {
                title: 'Atta & Rice',
                badge: 'Staple',
                img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80',
                action: 'marketplace',
              },
              {
                title: 'Organic Herbs',
                badge: 'GAP',
                img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80',
                action: 'marketplace',
              },
              {
                title: 'Dairy & Paneer',
                badge: 'Fresh',
                img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80',
                action: 'marketplace',
              },
              {
                title: 'Mandi Spices',
                badge: 'Pure',
                img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80',
                action: 'marketplace',
              },
              {
                title: 'B2B Bulk (100kg+)',
                badge: 'FPO',
                img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=200&q=80',
                action: 'bulk_marketplace',
              },
              {
                title: '⚡ 30-Min Kirana',
                badge: 'Express',
                img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80',
                action: 'consumer_home',
              },
            ].map((cat, i) => (
              <div
                key={i}
                onClick={() => setActivePage(cat.action as any)}
                className="flex flex-col items-center text-center cursor-pointer group space-y-1.5"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-b from-emerald-200 to-slate-200 dark:from-emerald-800 dark:to-slate-800 group-hover:from-emerald-600 group-hover:to-teal-700 transition-all">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-800 shadow-xs">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-300"
                    />
                  </div>
                  <span className="absolute -top-1 right-0 bg-amber-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-xs uppercase">
                    {cat.badge}
                  </span>
                </div>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                  {cat.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VALUE STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="font-extrabold text-white text-xs">⚡ 30-Min Fast Delivery</div>
              <div className="text-[10px] text-emerald-200">From nearest local kirana mart</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
              <Sprout className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-extrabold text-white text-xs">100% Farm Sourced</div>
              <div className="text-[10px] text-emerald-200">Direct from 500+ verified FPOs</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="font-extrabold text-white text-xs">Escrow Secured Payments</div>
              <div className="text-[10px] text-emerald-200">Protected buyer & farmer funds</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
              <Percent className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="font-extrabold text-white text-xs">Direct Mandi Pricing</div>
              <div className="text-[10px] text-emerald-200">Up to 35% below retail rates</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "MY SMART BASKET / BEST SELLERS" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                My Smart Basket (Direct Value Deals)
              </h2>
              <span className="bg-amber-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-xs">
                DAILY ESSENTIALS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Fresh farm vegetables & daily staples with guaranteed freshness
            </p>
          </div>

          <button
            onClick={() => setActivePage('marketplace')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All {products.length} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 8).map((product) => {
            const isFarmer = product.sellerType === 'farmer';
            const cartQty = getProductCartQty(product.id);
            const isWishlisted = wishlist.some((w) => w.id === product.id);
            const currentWeight = selectedPackWeight[product.id] || 1;
            const originalPrice = Math.round(product.pricePerKg * 1.35); // MRP calculation
            const discountPct = Math.round(
              ((originalPrice - product.pricePerKg) / originalPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group p-3.5 relative"
              >
                {/* Wishlist Button */}
                <button
                  onClick={() => addToWishlist(product)}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-xs hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Add to Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-current text-rose-500' : 'text-slate-400'
                    }`}
                  />
                </button>

                <div>
                  {/* Top Badges */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={`text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-xs ${isFarmer ? 'bg-emerald-700' : 'bg-amber-600'}`}>
                      {isFarmer ? 'Farm Direct' : 'Kirana Express'}
                    </span>
                    <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs">
                      {discountPct}% OFF
                    </span>
                  </div>

                  {/* Product Image */}
                  <div
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setActivePage('product_detail');
                    }}
                    className="relative h-40 bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden cursor-pointer mb-3"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-300" />
                      <span>{isFarmer ? 'Tomorrow Morning' : '⚡ 30 Mins'}</span>
                    </div>
                  </div>

                  {/* Brand & Seller */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400 truncate">{product.sellerName}</span>
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setActivePage('product_detail');
                    }}
                    className="font-bold text-slate-900 dark:text-white text-sm hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors line-clamp-1 cursor-pointer mb-2"
                  >
                    {product.name}
                  </h3>

                  {/* Weight Selector Dropdown */}
                  <div className="mb-3">
                    <select
                      value={currentWeight}
                      onChange={(e) => handleWeightChange(product.id, Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      <option value={0.5}>500 g - ₹{Math.round(product.pricePerKg * 0.5)}</option>
                      <option value={1}>1 kg - ₹{product.pricePerKg}</option>
                      <option value={2}>2 kg - ₹{product.pricePerKg * 2}</option>
                      <option value={5}>5 kg Family Pack - ₹{product.pricePerKg * 5}</option>
                    </select>
                  </div>
                </div>

                {/* Price & Add to Basket Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-slate-900 dark:text-white text-base">
                        ₹{product.pricePerKg * currentWeight}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through">
                        ₹{originalPrice * currentWeight}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                      (₹{product.pricePerKg}/kg)
                    </span>
                  </div>

                  {/* Stepper or Add Button */}
                  {cartQty > 0 ? (
                    <div className="flex items-center bg-emerald-700 text-white rounded-lg p-0.5 shadow-xs font-bold text-xs">
                      <button
                        onClick={() =>
                          cartQty === 1
                            ? removeFromCart(product.id)
                            : updateCartQuantity(product.id, cartQty - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center hover:bg-black/10 rounded cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 font-extrabold text-xs">{cartQty}</span>
                      <button
                        onClick={() => updateCartQuantity(product.id, cartQty + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-black/10 rounded cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        addToCart(product, currentWeight);
                        showToast(`Added ${currentWeight}kg ${product.name} to My Basket!`);
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all shadow-xs hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>ADD</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE "KISAN AI SMART PRICE COMPARISON" SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-amber-300 px-3 py-0.5 rounded-full text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kisan AI Engine v2.6 (Live Price Benchmarking)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Compare Prices: Farmer Direct vs. Local Kirana Store
              </h2>
              <p className="text-xs text-emerald-200">
                Transparent multi-factor algorithm calculating lowest cost, rapid 30-min delivery, and customer ratings.
              </p>
            </div>

            {/* Quick produce selectors */}
            <div className="flex items-center gap-2 bg-emerald-900/90 p-1 rounded-xl border border-emerald-700/60 overflow-x-auto text-xs font-bold">
              {['tomato', 'potato', 'onion', 'mango', 'rice'].map((prod) => (
                <button
                  key={prod}
                  onClick={() => setAiCompareProduce(prod)}
                  className={`px-3 py-1.5 rounded-lg transition-colors capitalize whitespace-nowrap cursor-pointer ${
                    aiCompareProduce === prod
                      ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  {prod}
                </button>
              ))}
            </div>
          </div>

          {/* Side-by-side comparison cards */}
          {compareResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Cheapest Option */}
                <div className="bg-emerald-900/60 border border-emerald-500/40 rounded-2xl p-4 space-y-2 shadow-md">
                  <span className="bg-emerald-500 text-slate-950 font-black text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                    💰 BEST PRICE
                  </span>
                  <h3 className="font-extrabold text-white text-base">
                    {compareResult.cheapest.seller}
                  </h3>
                  <div className="text-xs text-emerald-200">
                    Type: <strong className="text-white">{compareResult.cheapest.type}</strong>
                  </div>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-black text-amber-300">
                      ₹{compareResult.cheapest.price}
                    </span>
                    <span className="text-xs text-emerald-200">/ kg</span>
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono">
                    Total for {aiCompareQty}kg: <strong>₹{compareResult.cheapest.price * aiCompareQty}</strong>
                  </div>
                  <div className="text-[11px] text-emerald-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Delivery: {compareResult.cheapest.deliveryFormatted}</span>
                  </div>
                </div>

                {/* 2. Fastest Option */}
                <div className="bg-sky-950/60 border border-sky-500/40 rounded-2xl p-4 space-y-2 shadow-md">
                  <span className="bg-sky-400 text-slate-950 font-black text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                    ⚡ FASTEST DELIVERY
                  </span>
                  <h3 className="font-extrabold text-white text-base">
                    {compareResult.fastest.seller}
                  </h3>
                  <div className="text-xs text-sky-200">
                    Type: <strong className="text-white">{compareResult.fastest.type}</strong>
                  </div>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-black text-sky-300">
                      ₹{compareResult.fastest.price}
                    </span>
                    <span className="text-xs text-sky-200">/ kg</span>
                  </div>
                  <div className="text-[11px] text-sky-300 font-mono">
                    Total for {aiCompareQty}kg: <strong>₹{compareResult.fastest.price * aiCompareQty}</strong>
                  </div>
                  <div className="text-[11px] text-sky-200 flex items-center gap-1 font-bold">
                    <Clock className="w-3 h-3 text-sky-300" />
                    <span>Delivery: {compareResult.fastest.deliveryFormatted}</span>
                  </div>
                </div>

                {/* 3. Best Rated */}
                <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl p-4 space-y-2 shadow-md">
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                    ⭐ HIGHEST RATED
                  </span>
                  <h3 className="font-extrabold text-white text-base">
                    {compareResult.bestRated.seller}
                  </h3>
                  <div className="text-xs text-amber-200">
                    Type: <strong className="text-white">{compareResult.bestRated.type}</strong>
                  </div>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-black text-amber-300">
                      ₹{compareResult.bestRated.price}
                    </span>
                    <span className="text-xs text-amber-200">/ kg</span>
                  </div>
                  <div className="text-[11px] text-amber-300 flex items-center gap-1 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>Rating: {compareResult.bestRated.rating} ★ (Verified Quality)</span>
                  </div>
                </div>
              </div>

              {/* AI Recommendation banner */}
              <div className="bg-emerald-950/80 p-4 rounded-xl border border-emerald-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Kisan AI Strategic Recommendation</span>
                  </div>
                  <p className="text-emerald-100 leading-relaxed font-medium">
                    {compareResult.aiRecommendation}
                  </p>
                </div>

                <button
                  onClick={() => setActivePage('marketplace')}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shrink-0 cursor-pointer shadow-md"
                >
                  Order at Best Rate
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. B2B BULK MANDI SECTION (100kg to 10 Ton) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-colors">
          <div className="lg:col-span-7 space-y-4">
            <span className="bg-sky-100 dark:bg-sky-950/70 text-sky-900 dark:text-sky-300 text-xs font-mono font-black px-3 py-1 rounded-full uppercase">
              For Restaurants, Supermarkets & Caterers
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              B2B Wholesale Procurement from Verified FPOs
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Source large agricultural lots directly from farmer producer companies across Nashik, Punjab, and Karnataka. Benefit from tiered volume discounts, ISO quality testing reports, and automated Escrow contracts.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2 font-mono text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-400 block text-[10px]">MIN ORDER</span>
                <strong className="text-slate-900 dark:text-white text-sm">50 kg - 10 Ton</strong>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-400 block text-[10px]">SAVINGS</span>
                <strong className="text-emerald-700 dark:text-emerald-400 text-sm">Save 25-40%</strong>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-400 block text-[10px]">ESCROW</span>
                <strong className="text-sky-700 dark:text-sky-400 text-sm">100% Protected</strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActivePage('bulk_marketplace')}
                className="px-6 py-3 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Boxes className="w-4 h-4" />
                <span>Explore B2B Bulk Marketplace</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Farmer & FPO Direct Revenue Calculator</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Monthly Produce Harvest:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{calcMonthlyKg.toLocaleString()} kg</strong>
              </div>
              <input
                type="range"
                min={200}
                max={10000}
                step={100}
                value={calcMonthlyKg}
                onChange={(e) => setCalcMonthlyKg(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-mono">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Traditional Mandi Intermediaries:</span>
                <span>₹{traditionalEarnings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-800 dark:text-emerald-400 font-bold">
                <span>KisanSetu Direct Payout:</span>
                <span>₹{kisanSetuEarnings.toLocaleString()}</span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex justify-between text-emerald-950 dark:text-emerald-300 font-black text-sm">
                <span>Extra Farmer Income:</span>
                <span>+ ₹{netSurplus.toLocaleString()} / mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. QUALITY ASSURANCE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full uppercase tracking-wider">
            KisanSetu Quality Guarantee
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Why Shop on KisanSetu?
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            India's most dependable digital agricultural marketplace powered by transparency and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-center transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Direct Farm Fresh</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Harvested this morning from certified GAP farmers with farm provenance tracking.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-center transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">30-Min Local Fulfillment</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant delivery of daily vegetables & grocery items from verified local retail shops.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-center transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Escrow Buyer Protection</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Funds held securely in escrow until order delivery and quality verification.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-center transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">100% Replacement Policy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No questions asked replacement or instant refund if produce is not fresh.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
