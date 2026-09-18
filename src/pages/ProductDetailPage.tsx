import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ShieldCheck, MapPin, ShoppingCart, Heart, ArrowLeft, Truck, CheckCircle2, Sparkles, Store, Sprout } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { products, selectedProductId, setActivePage, addToCart, addToWishlist, wishlist, createOrder } = useApp();
  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const [qty, setQty] = useState(product?.minOrderKg || 5);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 flex items-center justify-center p-6 text-center transition-colors">
        <div className="space-y-4">
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Product not found.</p>
          <button
            onClick={() => setActivePage('marketplace')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const isFarmer = product.sellerType === 'farmer';
  const isWishlisted = wishlist.some((p) => p.id === product.id);

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 font-sans transition-colors">
      {/* Navigation breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => setActivePage('marketplace')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10 transition-colors">
          {/* Left: Image & Badges */}
          <div className="space-y-6">
            <div className="relative h-96 sm:h-[450px] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-inner">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                {isFarmer ? (
                  <span className="bg-emerald-700 text-white text-xs font-mono px-3 py-1.5 rounded-lg font-bold shadow-md flex items-center gap-1.5">
                    <Sprout className="w-4 h-4" /> 🌾 VERIFIED FARMER
                  </span>
                ) : (
                  <span className="bg-sky-600 text-white text-xs font-mono px-3 py-1.5 rounded-lg font-bold shadow-md flex items-center gap-1.5">
                    <Store className="w-4 h-4" /> 🏪 VERIFIED SHOP
                  </span>
                )}
              </div>
            </div>

            {/* Traceability / Trust Box */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-3">
              <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 text-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>KisanSetu Trust & Traceability Guarantee</span>
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300/80 leading-relaxed">
                This lot is backed by secure smart escrow payments. Funds are only released to the seller upon successful delivery and buyer inspection.
              </p>
            </div>
          </div>

          {/* Right: Details & Buying Actions */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full font-bold">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating} / 5.0 (Verified Reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Location: <strong className="text-slate-900 dark:text-white">{product.location}</strong></span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span>Sold by:</span>
                <strong className="text-slate-900 dark:text-white font-bold underline cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400">
                  {product.sellerName}
                </strong>
                {product.fpoName && <span className="text-xs text-slate-400 dark:text-slate-500">({product.fpoName})</span>}
              </div>

              <div className="pt-2 pb-4 border-y border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">₹{product.pricePerKg}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium"> /kg</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg font-bold">
                    {product.quantityAvailableKg} kg available in stock
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400 block">Minimum Order:</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{product.minOrderKg} kg</strong>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400 block">Harvest Date:</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{product.harvestDate || 'Freshly Harvested'}</strong>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Checkout Actions */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Select Quantity (kg):</span>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQty(Math.max(product.minOrderKg || 1, qty - 5))}
                    className="px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-extrabold text-sm text-slate-900 dark:text-white min-w-[60px] text-center">
                    {qty} kg
                  </span>
                  <button
                    onClick={() => setQty(qty + 5)}
                    className="px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => addToCart(product, qty)}
                  className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart (₹{qty * product.pricePerKg})</span>
                </button>
                <button
                  onClick={() => {
                    createOrder(product.id, qty, 'Consumer Home Delivery Address, Pune');
                    setActivePage('track_order');
                  }}
                  className="px-6 py-4 rounded-2xl bg-slate-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => addToWishlist(product)}
                  className={`p-4 rounded-2xl border transition-colors cursor-pointer ${
                    isWishlisted ? 'bg-rose-500 text-white border-rose-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
