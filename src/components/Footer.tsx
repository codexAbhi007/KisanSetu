import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  ShieldCheck,
  Award,
  Zap,
  Database,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <footer className="bg-[#06241b] dark:bg-slate-950 text-slate-300 dark:text-slate-400 pt-14 pb-10 border-t border-emerald-900/60 dark:border-slate-800 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-emerald-900/60 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 dark:bg-slate-900 flex items-center justify-center text-amber-400 shrink-0 border border-emerald-700/30 dark:border-slate-700">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">⚡ 30-Min Kirana Express</h4>
              <p className="text-[11px] text-emerald-200/80 dark:text-slate-400">Guaranteed doorstep delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 dark:bg-slate-900 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-700/30 dark:border-slate-700">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">Direct Farm Sourcing</h4>
              <p className="text-[11px] text-emerald-200/80 dark:text-slate-400">500+ verified FPOs & Farmers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 dark:bg-slate-900 flex items-center justify-center text-amber-400 shrink-0 border border-emerald-700/30 dark:border-slate-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">Escrow Protection</h4>
              <p className="text-[11px] text-emerald-200/80 dark:text-slate-400">100% Safe digital settlements</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 dark:bg-slate-900 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-700/30 dark:border-slate-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">Direct Mandi Pricing</h4>
              <p className="text-[11px] text-emerald-200/80 dark:text-slate-400">Zero middlemen commissions</p>
            </div>
          </div>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-amber-300 font-extrabold shadow-sm border border-emerald-400/30">
                <span className="text-base font-black font-mono">KS</span>
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                kisan<span className="text-amber-400">setu</span>
              </span>
            </div>
            <p className="text-emerald-100/70 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              India’s premier agricultural digital exchange network connecting farmers, FPOs, neighborhood kirana shops, and consumers with AI price intelligence, 30-min local fulfillment, and bulk wholesale logistics powered by Google Cloud Firestore.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono bg-emerald-950/80 dark:bg-slate-900 text-emerald-300 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-800/60 dark:border-slate-800 w-fit">
              <Database className="w-4 h-4 text-amber-400" />
              <span>CLOUD_FIRESTORE_CONNECTED</span>
            </div>
          </div>

          {/* KisanSetu Categories */}
          <div>
            <h4 className="font-bold text-amber-400 text-xs mb-3 uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/70 dark:text-slate-400">
              <li>
                <button onClick={() => setActivePage('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  Fresh Vegetables & Herbs
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  Farm Fresh Fruits
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  Atta, Rice & Dals
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  Cold Pressed Oils & Ghee
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('bulk_marketplace')} className="hover:text-white transition-colors cursor-pointer font-semibold text-amber-300">
                  B2B Mandi Lots (100kg+)
                </button>
              </li>
            </ul>
          </div>

          {/* Dashboards & Portals */}
          <div>
            <h4 className="font-bold text-amber-400 text-xs mb-3 uppercase tracking-wider">
              Partner Portals
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/70 dark:text-slate-400">
              <li>
                <button onClick={() => setActivePage('farmer_dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Farmer & FPO Desk
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('shopkeeper_dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Shopkeeper 30-Min Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('buyer_dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Bulk Buyer / Restaurant Desk
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('logistics_dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Cold-Chain Logistics Fleet
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin_dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Operations & Escrow Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Cities & Help */}
          <div>
            <h4 className="font-bold text-amber-400 text-xs mb-3 uppercase tracking-wider">
              Live Delivery Hubs
            </h4>
            <p className="text-xs text-emerald-100/70 dark:text-slate-400 leading-relaxed mb-3">
              Pune • Mumbai • Nashik • Bengaluru • Delhi NCR • Kolkata • Hyderabad • Ahmedabad
            </p>
            <div className="text-[11px] text-amber-300 font-mono space-y-1">
              <div>📞 National Helpline: 1800-KISAN-SETU</div>
              <div>⚡ 30-Min Express Active</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & certification bar */}
        <div className="pt-6 border-t border-emerald-900/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-300/60 dark:text-slate-500 font-mono">
          <p>© 2026 KisanSetu National Agri-Exchange Network. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setActivePage('network_architecture')} className="text-amber-300 hover:text-white transition-colors cursor-pointer">
              National Grid Architecture
            </button>
            <button onClick={() => setActivePage('fpo_pool')} className="text-emerald-300 hover:text-white transition-colors cursor-pointer">
              FPO Bulk Aggregation
            </button>
            <span className="text-amber-400 font-bold">100% Escrow Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
