import React from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { Sprout, ShieldCheck, Award, Zap, Phone, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  const { setActivePage } = useApp();
  const { t, language, setLanguage, availableLanguages } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 dark:text-slate-400 pt-12 pb-8 border-t border-slate-800 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top 4 Core Assurances for Farmers & Buyers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 pb-8 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shrink-0 border border-slate-800">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">
                {t("value_fast_title")}
              </h4>
              <p className="text-[11px] text-slate-400">
                {t("value_fast_sub")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shrink-0 border border-slate-800">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">
                {t("value_farm_title")}
              </h4>
              <p className="text-[11px] text-slate-400">
                {t("value_farm_sub")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-sky-400 shrink-0 border border-slate-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">
                {t("value_escrow_title")}
              </h4>
              <p className="text-[11px] text-slate-400">
                {t("value_escrow_sub")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shrink-0 border border-slate-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">
                {t("value_pricing_title")}
              </h4>
              <p className="text-[11px] text-slate-400">
                {t("value_pricing_sub")}
              </p>
            </div>
          </div>
        </div>

        {/* Clean Directory Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-300 font-extrabold shadow-sm">
                <span className="text-sm font-black font-mono">KS</span>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                kisan<span className="text-emerald-400">setu</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India’s unified digital agricultural marketplace connecting
              cultivators, neighborhood kirana merchants, and consumers with
              fair Mandi pricing and cold-chain logistics.
            </p>
            {/* Language Quick Toggle */}
            <div className="pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Language:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-slate-900 text-white font-bold text-xs py-1 px-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {availableLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.native} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">
              {t("popular_categories")}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActivePage("marketplace")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t("fruits_vegetables")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage("marketplace")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t("foodgrains_masala")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage("marketplace")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t("dairy_bakery")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage("bulk_marketplace")}
                  className="hover:text-white transition-colors cursor-pointer text-emerald-400 font-semibold"
                >
                  {t("b2b_bulk")}
                </button>
              </li>
            </ul>
          </div>

          {/* Partner Portals */}
          <div>
            <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">
              {t("partner_portals")}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActivePage("farmer_dashboard")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  🌾 Farmer & FPO Producer Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage("shopkeeper_dashboard")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  🏪 Kirana Merchant 30-Min Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage("bulk_marketplace")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  📦 Bulk Procurement Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage("logistics_dashboard")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  🚚 Cold-Chain Logistics Fleet
                </button>
              </li>
            </ul>
          </div>

          {/* Helpline & Support */}
          <div>
            <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">
              {t("helpline")}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
                <Phone className="w-4 h-4" />
                <span>1800-180-1551</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Toll-Free Kisan Advisory & Mandi Price Helpline (Available 24x7
                in All Indian Languages)
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setActivePage("contact")}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Contact Support & Hubs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 KisanSetu National Agri-Exchange. {t("all_rights_reserved")}
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setActivePage("about")}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              About KisanSetu
            </button>
            <button
              onClick={() => setActivePage("services")}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => setActivePage("network_architecture")}
              className="hover:text-slate-300 transition-colors cursor-pointer text-emerald-400"
            >
              {t("national_agri_grid")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
