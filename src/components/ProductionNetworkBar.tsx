import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Tractor,
  Store,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Zap,
  TrendingUp,
  Layers,
} from 'lucide-react';

export const ProductionNetworkBar: React.FC = () => {
  const { currentUser, activePage, setActivePage, loginWithRole, mandiPrices } = useApp();

  return (
    <div className="bg-[#032018] dark:bg-slate-950 text-emerald-100 dark:text-slate-300 px-3 sm:px-4 py-1 text-xs font-mono border-b border-emerald-900/60 dark:border-slate-800 sticky top-0 z-50 select-none shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Status: Cloud DB & Live Ticker */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center gap-1.5 bg-emerald-950/90 dark:bg-slate-900 border border-emerald-500/40 dark:border-emerald-500/30 text-white px-2 py-0.5 rounded-sm text-[10px] font-sans font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Database className="w-3 h-3 text-amber-400" />
            <span>FIRESTORE CLOUD ACTIVE</span>
          </div>

          {/* Live APMC Mandi Marquee */}
          <div className="hidden lg:flex items-center gap-3 text-[10px] text-emerald-200/90 dark:text-slate-400 overflow-hidden font-sans">
            <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> APMC LIVE:
            </span>
            {mandiPrices.slice(0, 3).map((item) => (
              <span key={item.id} className="inline-flex items-center gap-1 bg-black/40 dark:bg-slate-900/80 px-2 py-0.5 rounded text-emerald-100 dark:text-slate-200 border border-transparent dark:border-slate-800">
                <span className="font-semibold text-white">{item.commodity}:</span>
                <span className="text-amber-300 font-bold">₹{item.modalPrice}/kg</span>
                <span className={item.trend === 'up' ? 'text-emerald-400 text-[9px]' : item.trend === 'down' ? 'text-rose-400 text-[9px]' : 'text-slate-400 text-[9px]'}>
                  {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●'} {Math.abs(item.changePercent)}%
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Status: Persona / Fast Role Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {!currentUser ? (
            <button
              onClick={() => setActivePage('auth')}
              className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[11px] font-mono mr-1 shadow-xs cursor-pointer transition-all"
              title="Sign In / Register Portal"
            >
              <span>🔑 LOGIN / REGISTER</span>
            </button>
          ) : (
            <span className="hidden sm:inline text-[10px] text-emerald-400/80 dark:text-slate-400 mr-1 uppercase font-sans font-bold">
              Portal:
            </span>
          )}

          <button
            onClick={() => loginWithRole('farmer')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
              currentUser?.role === 'farmer'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'bg-emerald-900/60 dark:bg-slate-800 hover:bg-emerald-800/80 dark:hover:bg-slate-700 text-emerald-200 dark:text-slate-300'
            }`}
            title="Farmer Portal (Nashik Farm)"
          >
            <Tractor className="w-3 h-3" />
            <span>FARMER</span>
          </button>

          <button
            onClick={() => loginWithRole('shopkeeper')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
              currentUser?.role === 'shopkeeper'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'bg-emerald-900/60 dark:bg-slate-800 hover:bg-emerald-800/80 dark:hover:bg-slate-700 text-emerald-200 dark:text-slate-300'
            }`}
            title="Shopkeeper Portal (Kirana Mart)"
          >
            <Store className="w-3 h-3" />
            <span>KIRANA</span>
          </button>

          <button
            onClick={() => loginWithRole('consumer')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
              currentUser?.role === 'consumer'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-xs'
                : 'bg-emerald-900/60 dark:bg-slate-800 hover:bg-emerald-800/80 dark:hover:bg-slate-700 text-emerald-200 dark:text-slate-300'
            }`}
            title="Consumer Storefront"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>CONSUMER</span>
          </button>

          <button
            onClick={() => loginWithRole('bulk_buyer')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
              currentUser?.role === 'bulk_buyer'
                ? 'bg-indigo-400 text-slate-950 font-bold shadow-xs'
                : 'bg-emerald-900/60 dark:bg-slate-800 hover:bg-emerald-800/80 dark:hover:bg-slate-700 text-emerald-200 dark:text-slate-300'
            }`}
            title="Bulk Procurement & Wholesale"
          >
            <Zap className="w-3 h-3" />
            <span>BULK B2B</span>
          </button>

          <button
            onClick={() => loginWithRole('logistics_partner')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
              currentUser?.role === 'logistics_partner'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-emerald-900/60 dark:bg-slate-800 hover:bg-emerald-800/80 dark:hover:bg-slate-700 text-emerald-200 dark:text-slate-300'
            }`}
            title="Cold-Chain Logistics Fleet"
          >
            <Truck className="w-3 h-3" />
            <span>LOGISTICS</span>
          </button>

          <button
            onClick={() => loginWithRole('admin')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
              currentUser?.role === 'admin'
                ? 'bg-purple-400 text-slate-950 font-bold shadow-xs'
                : 'bg-emerald-900/60 dark:bg-slate-800 hover:bg-emerald-800/80 dark:hover:bg-slate-700 text-emerald-200 dark:text-slate-300'
            }`}
            title="Operations & Escrow Desk"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>ADMIN</span>
          </button>

          <button
            onClick={() => setActivePage('network_architecture')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ml-1 transition-all cursor-pointer ${
              activePage === 'network_architecture'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-emerald-950 dark:bg-slate-800 hover:bg-emerald-900 dark:hover:bg-slate-700 text-emerald-300 dark:text-slate-300'
            }`}
            title="National Agri-Grid Architecture"
          >
            <Layers className="w-3 h-3" />
            <span>GRID ARCHITECTURE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
