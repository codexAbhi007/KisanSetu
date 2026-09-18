import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, Store, MapPin, Star, ShieldCheck, ArrowLeft, ShoppingCart } from 'lucide-react';

export const SellerStorefrontPage: React.FC = () => {
  const { products, selectedSellerId, setActivePage, setSelectedProductId, addToCart } = useApp();

  // Find seller products
  const sellerProducts = products.filter((p) => p.sellerId === selectedSellerId || p.sellerName.toLowerCase().includes('patil') || p.sellerName.toLowerCase().includes('sharma'));
  const sampleProduct = sellerProducts[0];
  const sellerName = sampleProduct ? sampleProduct.sellerName : 'Patil Organic Agri Farm';
  const sellerType = sampleProduct?.sellerType || 'farmer';
  const location = sampleProduct ? sampleProduct.location : 'Nashik, Maharashtra';

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => setActivePage('marketplace')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Storefront Header */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl shadow-xl">
              {sellerType === 'farmer' ? '🌾' : '🏪'}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {sellerType === 'farmer' ? (
                  <span className="bg-emerald-600 text-white text-[10px] font-mono px-2.5 py-1 rounded-md font-bold">
                    🌾 VERIFIED FARMER & FPO SUPPLIER
                  </span>
                ) : (
                  <span className="bg-sky-600 text-white text-[10px] font-mono px-2.5 py-1 rounded-md font-bold">
                    🏪 VERIFIED LOCAL RETAIL SHOP
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">{sellerName}</h1>
              <p className="text-emerald-200 text-xs flex items-center gap-1.5 font-mono">
                <MapPin className="w-4 h-4 text-amber-300" /> {location} • 4.9 ★★★★★ Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          All Products & Produce from {sellerName}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellerProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setActivePage('product_detail');
                    }}
                    className="font-extrabold text-slate-900 dark:text-white text-base line-clamp-1 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹{product.pricePerKg}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium"> /kg</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded font-bold border border-emerald-200 dark:border-emerald-800">
                      {product.quantityAvailableKg} kg
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => addToCart(product, product.minOrderKg || 1)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
