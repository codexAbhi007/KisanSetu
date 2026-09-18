import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Users, TrendingUp, DollarSign, Boxes, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, orders } = useApp();
  const totalGMV = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-emerald-950 dark:bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-900 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                Operations Admin Desk
              </span>
              <span className="text-xs text-emerald-300 dark:text-slate-400">KisanSetu Platform Telemetry</span>
            </div>
            <h1 className="text-3xl font-extrabold">Platform Overview & Governance</h1>
            <p className="text-emerald-300 dark:text-slate-300 text-sm">
              Monitoring registered farmers, FPO aggregation pools, escrow transactions, and AI supply-chain integrity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total GMV (Escrow)</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">₹{totalGMV.toLocaleString()}</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">100% Secure Escrow Verified</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Registered Farmers & FPOs</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">1,420</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Nashik, Pune, Punjab, Bengal</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Marketplace Listings</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{products.length}</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Vegetables, Fruits, Grains</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Disputes / Fraud Flag</span>
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">0</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">All transactions healthy</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Platform Transactions & Escrow Status</h3>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">Order #{o.id} • {o.productName}</span>
                  <span className="text-slate-500 dark:text-slate-400">Buyer: {o.buyerName} | Seller: {o.sellerName}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm block">₹{o.total.toLocaleString()}</span>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded capitalize">
                    {o.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
