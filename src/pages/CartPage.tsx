import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Sprout, Store } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, setActivePage, createOrder } = useApp();

  const subtotal = cart.reduce((acc, item) => acc + item.product.pricePerKg * item.quantityKg, 0);
  const logisticsFee = Math.round(subtotal * 0.08);
  const total = subtotal + logisticsFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 font-sans transition-colors">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto text-3xl">
            🛒
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Your Cart is Empty</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Explore fresh farm produce and neighborhood shop items in the marketplace.
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

  const handleCheckoutAll = () => {
    cart.forEach((item) => {
      createOrder(item.product.id, item.quantityKg, 'Home Delivery Address, Pune - 411014');
    });
    clearCart();
    setActivePage('track_order');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Shopping Cart</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Multi-seller order separation with secure escrow</p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => {
              const isFarmer = item.product.sellerType === 'farmer';

              return (
                <div
                  key={item.product.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isFarmer ? (
                          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                            🌾 FARMER ORDER
                          </span>
                        ) : (
                          <span className="bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                            🏪 LOCAL SHOP ORDER
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{item.product.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Seller: <strong className="text-slate-900 dark:text-white">{item.product.sellerName}</strong></p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">₹{item.product.pricePerKg} /kg</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantityKg - 5)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-xs text-slate-900 dark:text-white">{item.quantityKg} kg</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantityKg + 5)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-extrabold text-slate-900 dark:text-white text-base min-w-[80px] text-right">
                      ₹{item.product.pricePerKg * item.quantityKg}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 h-fit transition-colors">
            <h3 className="font-extrabold text-slate-950 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Logistics & Refrigerated Van:</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{logisticsFee}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-sm">
                <span className="font-extrabold text-slate-900 dark:text-white">Total Escrow Amount:</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">₹{total}</span>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/60 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Secure Escrow Protected</span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Funds are held securely by KisanSetu until items are delivered and verified.
              </p>
            </div>

            <button
              onClick={handleCheckoutAll}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
