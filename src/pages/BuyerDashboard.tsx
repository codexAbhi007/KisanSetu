import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, ShoppingCart, TrendingDown, ShieldCheck, Truck, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const { currentUser, orders, setActivePage } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-emerald-950 dark:bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-900 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                Bulk Buyer Procurement Hub
              </span>
              <span className="text-xs text-emerald-300 dark:text-slate-400">FreshMart Restaurant Group & Supermarkets</span>
            </div>
            <h1 className="text-3xl font-extrabold">Welcome, {currentUser?.name || 'Vikram Malhotra'}!</h1>
            <p className="text-emerald-300 dark:text-slate-300 text-sm">
              Procuring directly from verified farmers and FPOs with smart logistics and escrow protection.
            </p>
          </div>
          <button
            onClick={() => setActivePage('marketplace')}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Procure Produce Now</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Procurement (MT)</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">42.5 MT</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> 18% lower cost vs wholesale mandis
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Shipments</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">3</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Live GPS tracking active</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Escrow Protected Funds</span>
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">₹89,000</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Released upon delivery</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Verified FPO Suppliers</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">12 FPOs</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Nashik, Punjab, Ratnagiri</span>
          </div>
        </div>

        {/* Active Procurement Orders */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Active Bulk Orders & Logistics Tracking</h3>
            <button
              onClick={() => setActivePage('track_order')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Live Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Produce</th>
                  <th className="p-4">Quantity (kg)</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Escrow Status</th>
                  <th className="p-4">Delivery Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">#{o.id}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{o.productName}</td>
                    <td className="p-4 font-bold">{o.quantityKg.toLocaleString()} kg</td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">₹{o.total.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded capitalize">
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded capitalize">
                        {o.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setActivePage('track_order')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer"
                      >
                        Track GPS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
