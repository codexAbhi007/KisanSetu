import React from 'react';
import { useApp } from '../context/AppContext';
import { Truck, MapPin, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SessionVerificationBanner } from '../components/SessionVerificationBanner';

export const LogisticsDashboard: React.FC = () => {
  const { currentUser, orders, setActivePage } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <SessionVerificationBanner portalRole="logistics_partner" portalTitle="🚚 Logistics Partner Section (Cold-Chain Fleet)" />

        <div className="bg-emerald-900 dark:bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-800 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                Smart Logistics & Cold Chain Hub
              </span>
              <span className="text-xs text-emerald-300 dark:text-slate-400">Kisan Express Logistics</span>
            </div>
            <h1 className="text-3xl font-extrabold">Welcome, {currentUser?.name || 'Amit Das'}!</h1>
            <p className="text-emerald-100 dark:text-slate-300 text-sm">
              Optimized multi-stop delivery routes and live GPS tracking for agricultural cold chain transit.
            </p>
          </div>
          <button
            onClick={() => setActivePage('track_order')}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Navigation className="w-5 h-5" />
            <span>Open GPS Map</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Delivery Jobs</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">2</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Route optimized by AI (-15% distance)</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Vehicle Capacity</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">1,500 / 2,000 kg</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Refrigerated Van (MH-12-QZ-4821)</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Monthly Earnings</span>
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">₹42,000</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">All escrow verified</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-6 space-y-4 transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Assigned Delivery Jobs</h3>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Order #{o.id} - {o.productName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Pickup: Nashik Farm • Drop: {o.deliveryAddress}</p>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">Quantity: {o.quantityKg} kg</p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePage('track_order')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Start GPS Guidance
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
