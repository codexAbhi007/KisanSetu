import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, User, RefreshCw, LogOut, LogIn, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface SessionVerificationBannerProps {
  portalRole: UserRole;
  portalTitle: string;
}

export const SessionVerificationBanner: React.FC<SessionVerificationBannerProps> = ({
  portalRole,
  portalTitle,
}) => {
  const { currentUser, setIsRoleSelectOpen, handleLogout, setActivePage, loginWithRole } = useApp();

  const isRoleMatched = currentUser?.role === portalRole;

  const getRoleTheme = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/70',
          border: 'border-emerald-300 dark:border-emerald-800',
          badge: 'bg-emerald-700 text-white',
          text: 'text-emerald-900 dark:text-emerald-200',
          icon: '🌾',
        };
      case 'shopkeeper':
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/70',
          border: 'border-indigo-300 dark:border-indigo-800',
          badge: 'bg-indigo-700 text-white',
          text: 'text-indigo-900 dark:text-indigo-200',
          icon: '🏪',
        };
      case 'consumer':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/70',
          border: 'border-amber-300 dark:border-amber-800',
          badge: 'bg-amber-500 text-slate-950 font-black',
          text: 'text-amber-950 dark:text-amber-200',
          icon: '🛒',
        };
      case 'logistics_partner':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/70',
          border: 'border-sky-300 dark:border-sky-800',
          badge: 'bg-sky-700 text-white',
          text: 'text-sky-900 dark:text-sky-200',
          icon: '🚚',
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-900',
          border: 'border-slate-300 dark:border-slate-800',
          badge: 'bg-slate-700 text-white',
          text: 'text-slate-900 dark:text-slate-200',
          icon: '👤',
        };
    }
  };

  const theme = getRoleTheme(portalRole);

  return (
    <div
      id={`session-verification-banner-${portalRole}`}
      className={`${theme.bg} ${theme.border} border-2 rounded-2xl p-3.5 sm:p-4 shadow-sm mb-6 transition-all font-sans`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: User Identity & Verified Session Status */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shrink-0">
            {theme.icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                <span>ACTIVE SESSION VERIFIED</span>
              </span>

              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${theme.badge}`}>
                {portalTitle}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Logged In As: {currentUser?.name || `Default ${portalTitle} User`}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                • UID: {currentUser?.uid || `user-${portalRole}-01`} • Status: 🟢 Active
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Location:{' '}
              <strong>
                {currentUser?.location?.villageOrCity || 'Pune'}, {currentUser?.location?.state || 'Maharashtra'}
              </strong>{' '}
              ({currentUser?.phone || '+91 98000 12345'})
            </p>
          </div>
        </div>

        {/* Right: Quick Testing & Role Switching Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800">
          <button
            id={`verify-switch-role-${portalRole}-btn`}
            onClick={() => setIsRoleSelectOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            title="Switch portal to Farmer, Shopkeeper, Consumer, or Logistics"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Switch Role (All 4)</span>
          </button>

          <button
            id={`verify-relogin-${portalRole}-btn`}
            onClick={() => setActivePage('auth')}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            title="Open Auth Gateway to test credentials or OTP"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-950" />
            <span>🔑 Fresh Login Gateway</span>
          </button>

          <button
            id={`verify-logout-${portalRole}-btn`}
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Log out to test clean guest state"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
