import React from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, LogOut, CheckCircle2, User, Sparkles, RefreshCw } from 'lucide-react';
import { UserRole } from '../types';

export const AuthStatusBar: React.FC = () => {
  const { currentUser, loginWithRole, handleLogout, setActivePage, setIsRoleSelectOpen } = useApp();

  const handleRoleQuickLogin = (role: UserRole, roleName: string) => {
    loginWithRole(role);
  };

  return (
    <div
      id="kisansetu-auth-status-bar"
      className="bg-slate-900 dark:bg-slate-950 text-white border-b-2 border-amber-400 py-2 px-3 sm:px-6 shadow-md transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* Left: Active Authentication State */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="font-mono font-black text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              {currentUser ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              )}
            </span>
            <span>AUTH STATUS:</span>
          </span>

          {currentUser ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-600 text-white font-extrabold px-2.5 py-0.5 rounded-md text-[11px] flex items-center gap-1 shadow-xs uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                {currentUser.role === 'farmer' && '🌾 Farmer'}
                {currentUser.role === 'shopkeeper' && '🏪 Shopkeeper'}
                {currentUser.role === 'consumer' && '🛒 Consumer'}
                {currentUser.role === 'logistics_partner' && '🚚 Logistics'}
                {!['farmer', 'shopkeeper', 'consumer', 'logistics_partner'].includes(currentUser.role) &&
                  currentUser.role.replace('_', ' ')}
              </span>

              <span className="text-white font-bold">
                {currentUser.name}
              </span>

              <span className="text-slate-400 hidden lg:inline text-[11px]">
                ({currentUser.location?.villageOrCity || currentUser.location?.district || 'Verified'})
              </span>

              <span className="bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                🟢 LOGGED IN
              </span>

              <button
                id="status-bar-logout-btn"
                onClick={handleLogout}
                className="ml-1 px-2.5 py-1 rounded bg-rose-700/80 hover:bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                title="Log out from current account"
              >
                <LogOut className="w-3 h-3" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-slate-800 text-amber-300 font-bold px-2 py-0.5 rounded text-[11px] border border-amber-400/40">
                🔒 NOT LOGGED IN (Guest Mode)
              </span>
              <button
                id="status-bar-login-now-btn"
                onClick={() => setActivePage('auth')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1 rounded-md text-xs shadow-sm flex items-center gap-1 cursor-pointer transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>🔑 Click Here to Log In</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick Login Test Buttons for ALL 4 ROLES */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-300 uppercase tracking-tight flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Test 4-Role Login:</span>
          </span>

          {/* 1. Farmer Login */}
          <button
            id="quick-login-farmer-btn"
            onClick={() => handleRoleQuickLogin('farmer', 'Farmer')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-xs border ${
              currentUser?.role === 'farmer'
                ? 'bg-emerald-600 text-white border-emerald-300 ring-2 ring-emerald-400/70 font-black'
                : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border-emerald-700/60'
            }`}
            title="Log in as Farmer (Patil Organic Agri Farm, Nashik)"
          >
            <span>🌾</span>
            <span>Farmer</span>
            {currentUser?.role === 'farmer' && <span className="text-[9px] bg-emerald-800 px-1 rounded">ACTIVE</span>}
          </button>

          {/* 2. Shopkeeper Login */}
          <button
            id="quick-login-shopkeeper-btn"
            onClick={() => handleRoleQuickLogin('shopkeeper', 'Shopkeeper')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-xs border ${
              currentUser?.role === 'shopkeeper'
                ? 'bg-indigo-600 text-white border-indigo-300 ring-2 ring-indigo-400/70 font-black'
                : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border-indigo-700/60'
            }`}
            title="Log in as Shopkeeper (Sharma Fresh Mart & Kirana)"
          >
            <span>🏪</span>
            <span>Shopkeeper</span>
            {currentUser?.role === 'shopkeeper' && <span className="text-[9px] bg-indigo-800 px-1 rounded">ACTIVE</span>}
          </button>

          {/* 3. Consumer Login */}
          <button
            id="quick-login-consumer-btn"
            onClick={() => handleRoleQuickLogin('consumer', 'Consumer')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-xs border ${
              currentUser?.role === 'consumer'
                ? 'bg-amber-500 text-slate-950 border-amber-200 ring-2 ring-amber-300 font-black'
                : 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border-amber-700/60'
            }`}
            title="Log in as Consumer (Ananya Sharma - Fresh Market Delivery)"
          >
            <span>🛒</span>
            <span>Consumer</span>
            {currentUser?.role === 'consumer' && <span className="text-[9px] bg-amber-600 text-white px-1 rounded">ACTIVE</span>}
          </button>

          {/* 4. Logistics Login */}
          <button
            id="quick-login-logistics-btn"
            onClick={() => handleRoleQuickLogin('logistics_partner', 'Logistics Partner')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-xs border ${
              currentUser?.role === 'logistics_partner'
                ? 'bg-sky-600 text-white border-sky-300 ring-2 ring-sky-400/70 font-black'
                : 'bg-sky-950/80 hover:bg-sky-900 text-sky-200 border-sky-700/60'
            }`}
            title="Log in as Logistics (Amit Das - Cold-Chain Fleet & Transport)"
          >
            <span>🚚</span>
            <span>Logistics</span>
            {currentUser?.role === 'logistics_partner' && <span className="text-[9px] bg-sky-800 px-1 rounded">ACTIVE</span>}
          </button>

          {/* Full Gateway Link */}
          <button
            id="status-bar-all-roles-modal-btn"
            onClick={() => setIsRoleSelectOpen(true)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-bold cursor-pointer transition-colors"
            title="Open Role Selection & Portal Switcher Dialog"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
