import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  X,
  Trash2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Truck,
  Zap,
  Plus,
  Minus,
  Clock,
  Tag,
} from 'lucide-react';

export const CartCheckoutModal: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    setActivePage,
  } = useApp();

  const [address, setAddress] = useState('Flat 402, Clover Apartment, Viman Nagar, Pune, MH 411014');
  const [deliverySlot, setDeliverySlot] = useState<'express' | 'standard'>('express');
  const [checkedOut, setCheckedOut] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.pricePerKg * item.quantityKg, 0);
  const originalSubtotal = Math.round(subtotal * 1.35);
  const totalSavings = originalSubtotal - subtotal;
  const deliveryFee = subtotal > 200 ? 0 : 30;
  const total = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Create order for first item as demo showcase
    const firstItem = cart[0];
    const order = createOrder(firstItem.product.id, firstItem.quantityKg, address);
    setPlacedOrderId(order.id);
    setCheckedOut(true);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="bg-[#064e3b] dark:bg-emerald-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-amber-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base leading-tight">My Basket</h2>
              <p className="text-[10px] text-emerald-200">{cart.length} produce item(s)</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setCheckedOut(false);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Savings banner */}
        {totalSavings > 0 && !checkedOut && (
          <div className="bg-amber-50 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 px-4 py-2 border-b border-amber-200 dark:border-amber-900 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Direct Farm & Kirana Savings:</span>
            </div>
            <span className="text-emerald-800 dark:text-emerald-400 font-black">You save ₹{totalSavings}!</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          {checkedOut ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white">Order Placed Successfully!</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs max-w-xs mx-auto">
                Order <span className="font-bold text-emerald-800 dark:text-emerald-400">#{placedOrderId}</span> has been confirmed and placed under KisanSetu Escrow protection.
              </p>
              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setCheckedOut(false);
                    setIsCartOpen(false);
                    setActivePage('track_order');
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Live Delivery on GPS Map</span>
                </button>
                <button
                  onClick={() => {
                    setCheckedOut(false);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">Your basket is currently empty.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Explore our fresh farm vegetables, seasonal fruits, and 30-min express neighborhood kirana items.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActivePage('marketplace');
                }}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Basket Items List */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                  Basket Items ({cart.length})
                </h3>
                {cart.map((item, idx) => {
                  const isFarmer = item.product.sellerType === 'farmer';
                  const itemTotal = item.product.pricePerKg * item.quantityKg;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <span className="text-[9px] font-black uppercase bg-emerald-700 text-white px-1.5 py-0.2 rounded-xs">
                              {isFarmer ? 'Farm Direct' : '30-Min Kirana'}
                            </span>
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Seller: {item.product.sellerName}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity Stepper & Item Price */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700/60 rounded-lg p-0.5 font-bold">
                          <button
                            onClick={() =>
                              item.quantityKg <= 1
                                ? removeFromCart(item.product.id)
                                : updateCartQuantity(item.product.id, item.quantityKg - 1)
                            }
                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 rounded cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-slate-900 dark:text-white text-xs">
                            {item.quantityKg} kg
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantityKg + 1)
                            }
                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 rounded cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-slate-900 dark:text-white text-sm">₹{itemTotal}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">
                            (₹{item.product.pricePerKg}/kg)
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Slot Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Delivery Slot
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliverySlot('express')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      deliverySlot === 'express'
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-950 dark:text-amber-200 font-bold ring-1 ring-amber-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-black text-[11px]">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>30 MIN EXPRESS</span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">In 25-35 minutes</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliverySlot('standard')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      deliverySlot === 'standard'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-200 font-bold ring-1 ring-emerald-500'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-black text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>STANDARD HARVEST</span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Tomorrow 6 AM - 8 AM</p>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Delivery Address</span>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 normal-case font-bold">Pune</span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Bill Details / Price Breakdown */}
              <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="font-extrabold text-slate-900 dark:text-white mb-2">Bill Details</div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Basket MRP Subtotal:</span>
                  <span className="line-through">₹{originalSubtotal}</span>
                </div>

                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                  <span>Direct Farm Discount:</span>
                  <span>- ₹{totalSavings}</span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Special Item Subtotal:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Delivery Charge:</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-slate-900 dark:text-white text-sm">
                  <span>Total Amount Payable:</span>
                  <span className="text-base text-emerald-800 dark:text-emerald-400">₹{total}</span>
                </div>
              </div>

              {/* Escrow Guarantee */}
              <div className="bg-emerald-50 dark:bg-emerald-950/70 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-[11px] text-emerald-950 dark:text-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Escrow Protected:</strong> Funds released to seller only after quality confirmation.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout CTA Button */}
        {!checkedOut && cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.01] flex items-center justify-between px-5 cursor-pointer"
            >
              <span>PAY ₹{total} & ORDER</span>
              <div className="flex items-center gap-1">
                <span>CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
