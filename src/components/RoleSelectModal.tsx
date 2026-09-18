import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, Store, ShoppingBag, X, ArrowRight, ShieldCheck, Zap, Truck } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSelectModal: React.FC<RoleSelectModalProps> = ({ isOpen, onClose }) => {
  const { setActivePage, loginWithRole, currentUser, handleLogout } = useApp();

  if (!isOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    onClose();
    loginWithRole(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#f1f8e9] dark:bg-emerald-950/80 text-[#2e5d16] dark:text-emerald-300 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#c5e1a5] dark:border-emerald-800">
            <Sprout className="w-3.5 h-3.5 text-[#689f38] dark:text-emerald-400" />
            <span>KisanSetu Platform Roles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Choose Your Platform Portal
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Select one of the 4 core platform sections. Farmers and Shopkeepers can manage their own database, and toggle Logistics & Bulk Quantity options anytime in Settings.
          </p>
        </div>

        {/* 4 Core Role Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Farmer Card */}
          <div
            id="role-modal-farmer-card"
            onClick={() => handleSelectRole('farmer')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              currentUser?.role === 'farmer'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 shadow-lg ring-2 ring-emerald-400/50'
                : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-sm">
                  🌾
                </div>
                <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  PRODUCER
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Farmer Section</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  Maintain your harvest database for crops, fruits, vegetables & dairy with AI mandi pricing.
                </p>
              </div>

              {/* Integrated features inside Farmer */}
              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span><strong>Logistics:</strong> Fleet pickup</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong>Bulk:</strong> Mandi wholesale lots</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
              <span>Access Farmer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Shopkeeper Card */}
          <div
            id="role-modal-shopkeeper-card"
            onClick={() => handleSelectRole('shopkeeper')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              currentUser?.role === 'shopkeeper'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 shadow-lg ring-2 ring-indigo-400/50'
                : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-sm">
                  🏪
                </div>
                <span className="text-[10px] font-black text-indigo-800 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  KIRANA MART
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Shopkeeper Section</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  Maintain retail grocery store inventory for fresh produce, dairy, and daily essentials.
                </p>
              </div>

              {/* Integrated features inside Shopkeeper */}
              <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/60 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Truck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>Logistics:</strong> 30-min express</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong>Bulk:</strong> Restocking orders</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
              <span>Access Shopkeeper</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Consumer Card */}
          <div
            id="role-modal-consumer-card"
            onClick={() => handleSelectRole('consumer')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              currentUser?.role === 'consumer'
                ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-500 shadow-lg ring-2 ring-amber-400/50'
                : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-sm">
                  🛒
                </div>
                <span className="text-[10px] font-black text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  HOUSEHOLD
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Consumer Section</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  Order farm-fresh produce, fruits, vegetables, dairy, and groceries delivered to your door.
                </p>
              </div>

              {/* Consumer clean experience */}
              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/60 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span><strong>Zero Clutter:</strong> 1-click cart</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong>Instant:</strong> 30-min delivery</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
              <span>Access Consumer Market</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4. Logistics Card */}
          <div
            id="role-modal-logistics-card"
            onClick={() => handleSelectRole('logistics_partner')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              currentUser?.role === 'logistics_partner'
                ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-500 shadow-lg ring-2 ring-sky-400/50'
                : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50/50 dark:hover:bg-sky-950/40 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-2xl shadow-sm">
                  🚚
                </div>
                <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  COLD-CHAIN FLEET
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Logistics Section</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  Manage fleet dispatches, farm-to-hub pickups, GPS route tracking, and cold storage vans.
                </p>
              </div>

              {/* Integrated features inside Logistics */}
              <div className="pt-2 border-t border-sky-200/60 dark:border-sky-900/60 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Truck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span><strong>Fleet Tracking:</strong> Real-time GPS</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong>Cold Chain:</strong> IoT temperature safe</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
              <span>Access Logistics Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer info & Logout */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs">
              {currentUser ? (
                <>
                  Logged In As: <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> (
                  <span className="text-emerald-600 dark:text-emerald-400 uppercase font-black">{currentUser.role.replace('_', ' ')}</span>
                  )
                </>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-bold">Session: Not Logged In (Guest)</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setActivePage('auth');
              }}
              className="px-3 py-1.5 rounded-lg text-slate-950 font-black bg-amber-400 hover:bg-amber-300 text-xs cursor-pointer transition-colors shadow-xs flex items-center gap-1"
            >
              <span>🔑 Full Login Gateway →</span>
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold text-xs cursor-pointer transition-colors border border-rose-200 dark:border-rose-900"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
