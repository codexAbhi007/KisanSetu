import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ShieldCheck,
  Star,
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Apple,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const {
    products,
    addToCart,
    cart,
    updateCartQuantity,
    removeFromCart,
    addToWishlist,
    wishlist,
    setSelectedProductId,
    setActivePage,
    showToast,
    globalSearchQuery,
    setGlobalSearchQuery,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(globalSearchQuery);

  // Keep this page's filter in sync with the Navbar's global mega-search
  useEffect(() => {
    setSearchQuery(globalSearchQuery);
  }, [globalSearchQuery]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sellerTypeFilter, setSellerTypeFilter] = useState<'all' | 'farmer' | 'shopkeeper'>('all');
  const [speedFilter, setSpeedFilter] = useState<'all' | 'express' | 'standard'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating'>('relevance');
  const [selectedPackWeight, setSelectedPackWeight] = useState<Record<string, number>>({});

  const categories = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Pulses',
    'Spices',
    'Dairy',
    'Organic',
  ];

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Organic' && p.farmingMethod?.toLowerCase().includes('gap'));

      const matchesSeller =
        sellerTypeFilter === 'all' || p.sellerType === sellerTypeFilter;

      const matchesSpeed =
        speedFilter === 'all' ||
        (speedFilter === 'express' && p.sellerType === 'shopkeeper') ||
        (speedFilter === 'standard' && p.sellerType === 'farmer');

      return matchesSearch && matchesCategory && matchesSeller && matchesSpeed;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.pricePerKg - b.pricePerKg;
      if (sortBy === 'price_high') return b.pricePerKg - a.pricePerKg;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const getProductCartQty = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    return item ? item.quantityKg : 0;
  };

  const handleWeightChange = (productId: string, weightKg: number) => {
    setSelectedPackWeight((prev) => ({ ...prev, [productId]: weightKg }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 px-4 sm:px-6 lg:px-8 font-sans pb-20 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Breadcrumb & Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1">
              <span>Home</span> &gt; <span className="text-emerald-700 dark:text-emerald-400 font-bold">Fruits, Vegetables & Staples Marketplace</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Farm Fresh & Grocery Produce Catalog
            </h1>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:border-emerald-600 shadow-2xs cursor-pointer"
            >
              <option value="relevance">Popularity / Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR FILTERS */}
          <aside className="lg:col-span-3 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Filters</span>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSellerTypeFilter('all');
                  setSpeedFilter('all');
                  setSearchQuery('');
                  setGlobalSearchQuery('');
                }}
                className="text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Category
              </h3>
              <div className="space-y-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between font-medium transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Seller Type Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Source & Seller
              </h3>
              <div className="space-y-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sellerType"
                    checked={sellerTypeFilter === 'all'}
                    onChange={() => setSellerTypeFilter('all')}
                    className="accent-emerald-700"
                  />
                  <span>All Verified Sellers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sellerType"
                    checked={sellerTypeFilter === 'farmer'}
                    onChange={() => setSellerTypeFilter('farmer')}
                    className="accent-emerald-700"
                  />
                  <span>🌾 Direct Farmer / FPO Lots</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sellerType"
                    checked={sellerTypeFilter === 'shopkeeper'}
                    onChange={() => setSellerTypeFilter('shopkeeper')}
                    className="accent-emerald-700"
                  />
                  <span>🏪 Local Kirana Stores</span>
                </label>
              </div>
            </div>

            {/* Delivery Speed Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Delivery Speed
              </h3>
              <div className="space-y-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="speedFilter"
                    checked={speedFilter === 'all'}
                    onChange={() => setSpeedFilter('all')}
                    className="accent-emerald-700"
                  />
                  <span>All Delivery Speeds</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="speedFilter"
                    checked={speedFilter === 'express'}
                    onChange={() => setSpeedFilter('express')}
                    className="accent-amber-600"
                  />
                  <span className="text-amber-700 dark:text-amber-400 font-bold">⚡ 30-Min Express (Local Mart)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="speedFilter"
                    checked={speedFilter === 'standard'}
                    onChange={() => setSpeedFilter('standard')}
                    className="accent-emerald-700"
                  />
                  <span>Standard 1-Day (Direct Harvest)</span>
                </label>
              </div>
            </div>

            {/* KisanSetu Quality Guarantee */}
            <div className="bg-emerald-50 dark:bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 space-y-2 text-[11px]">
              <div className="font-extrabold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>100% Quality Assurance</span>
              </div>
              <p className="text-emerald-900/80 dark:text-emerald-300/80 leading-tight">
                Fresh harvest guarantee with escrow protection.
              </p>
            </div>
          </aside>

          {/* MAIN PRODUCT CATALOG GRID */}
          <main className="lg:col-span-9 space-y-4">
            {/* Search Input within Catalog */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3 transition-colors">
              <Search className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter catalog by product name, farmer, or region..."
                className="w-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none bg-transparent"
              />
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">
                {filteredProducts.length} items
              </span>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                      {/* Wishlist Icon */}
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

                        {/* Image */}
                        <div
                          onClick={() => {
                            setSelectedProductId(product.id);
                            setActivePage('product_detail');
                          }}
                          className="relative h-44 bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden cursor-pointer mb-3"
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

                        {/* Seller & Rating */}
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
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
                <Apple className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">No Products Found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try adjusting your filters, clearing your search query, or checking other categories.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSellerTypeFilter('all');
                    setSpeedFilter('all');
                    setSearchQuery('');
                    setGlobalSearchQuery('');
                  }}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
