import React from "react";
import { useApp } from "../context/AppContext";
import { MapPin, User, LogOut, Sliders } from "lucide-react";
import { UserRole } from "../types";

interface SessionVerificationBannerProps {
  portalRole: UserRole;
  portalTitle: string;
}

export const SessionVerificationBanner: React.FC<
  SessionVerificationBannerProps
> = ({ portalRole, portalTitle }) => {
  const { currentUser, setIsRoleSelectOpen, setIsSettingsOpen, handleLogout } =
    useApp();

  const getRoleTheme = (role: UserRole) => {
    switch (role) {
      case "farmer":
        return {
          icon: "🌾",
          roleLabel: "Producer / Cultivator",
          badgeClass:
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-800",
        };
      case "shopkeeper":
        return {
          icon: "🏪",
          roleLabel: "Local Kirana Partner",
          badgeClass:
            "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300/60 dark:border-indigo-800",
        };
      case "consumer":
        return {
          icon: "🛒",
          roleLabel: "Household Consumer",
          badgeClass:
            "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300/60 dark:border-amber-800",
        };
      case "logistics_partner":
        return {
          icon: "🚚",
          roleLabel: "Cold-Chain Fleet",
          badgeClass:
            "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300/60 dark:border-sky-800",
        };
      default:
        return {
          icon: "👤",
          roleLabel: "Member",
          badgeClass:
            "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
        };
    }
  };

  const theme = getRoleTheme(portalRole);

  return (
    <div
      id={`session-verification-banner-${portalRole}`}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs mb-6 transition-all font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: User context */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shrink-0">
            {theme.icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {currentUser?.name || `Demo ${portalTitle}`}
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${theme.badgeClass}`}
              >
                {theme.roleLabel}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {currentUser?.location?.villageOrCity || "Pune"},{" "}
                {currentUser?.location?.state || "Maharashtra"}
              </span>
              <span>•</span>
              <span className="font-mono text-[11px]">
                {currentUser?.phone || "+91 98000 12345"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => setIsRoleSelectOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Switch portal role"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Switch Role</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
            title="Preferences & Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 cursor-pointer transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
