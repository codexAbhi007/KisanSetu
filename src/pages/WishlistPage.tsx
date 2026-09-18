import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Star, ShoppingCart, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, addToCart, setActivePage, setSelectedProductId } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 font-sans transition-colors">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto text-3xl">
            ❤
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Save your favorite farm produce and neighborhood shops to easily reorder.
          </p>
          <button
            onClick={() => setActivePage('marketplace')}
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            Explore Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Saved Wishlist</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{wishlist.length} saved products and suppliers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-100 dark:bg-slate-800">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
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
