import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SessionVerificationBanner } from '../components/SessionVerificationBanner';
import {
  Search,
  MapPin,
  Star,
  ShoppingCart,
  Heart,
  Sprout,
  Clock,
  Plus,
  Minus,
  Zap,
} from 'lucide-react';

export const ConsumerHomePage: React.FC = () => {
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
    globalSearchQuery,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(globalSearchQuery);

  // Reflect the Navbar's global mega-search when arriving on this page
  useEffect(() => {
    setSearchQuery(globalSearchQuery);
  }, [globalSearchQuery]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'express' | 'farm'>('all');
  const [selectedPackWeight, setSelectedPackWeight] = useState<Record<string, number>>({});

  const categories = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Organic',
    'Spices',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'Organic' && p.farmingMethod?.toLowerCase().includes('gap'));

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'express' && p.sellerType === 'shopkeeper') ||
      (activeTab === 'farm' && p.sellerType === 'farmer');

    return matchesSearch && matchesCategory && matchesTab;
  });

  const getProductCartQty = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    return item ? item.quantityKg : 0;
  };

  const handleWeightChange = (productId: string, weightKg: number) => {
    setSelectedPackWeight((prev) => ({ ...prev, [productId]: weightKg }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <SessionVerificationBanner portalRole="consumer" portalTitle="🛒 Consumer Section (Household Market)" />
      </div>

      {/* 1. TOP PROMOTIONAL BANNER STRIP */}
      <section className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] dark:from-emerald-950 dark:via-emerald-900 dark:to-teal-950 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-black/30 text-amber-300 px-3 py-0.5 rounded-full text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>KisanSetu Express Store</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Direct Farm Harvest & 30-Minute Kirana Mart
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Enjoy farm-gate discounts directly from cultivators or order instant 30-minute supplies from verified neighborhood grocery partners.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3.5 rounded-2xl shadow-lg space-y-1 text-xs border border-emerald-100 dark:border-emerald-900">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Delivery Address:</span>
              </div>
              <p className="font-extrabold text-slate-900 dark:text-white text-xs">
                Flat 402, Koregaon Park, Pune
              </p>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                ⚡ 30-Min Express Slots Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN STOREFRONT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toggle Mode Tabs (All, 30-Min Kirana Express, Farm Direct) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Items ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('express')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'express'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>⚡ 30-Min Kirana Express</span>
            </button>

            <button
              onClick={() => setActiveTab('farm')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'farm'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-900'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Direct Farm Fresh (Next Morning)</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search produce or shop..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const isFarmer = product.sellerType === 'farmer';
            const cartQty = getProductCartQty(product.id);
            const isWishlisted = wishlist.some((w) => w.id === product.id);
            const currentWeight = selectedPackWeight[product.id] || 1;
            const originalPrice = Math.round(product.pricePerKg * 1.35);
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
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-xs hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
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
                    <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs">
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
      </div>
    </div>
  );
};
