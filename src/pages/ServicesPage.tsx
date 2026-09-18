import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Boxes, Truck, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { setActivePage } = useApp();

  useEffect(() => {
    document.title = "Our Services | KisanSetu Agricultural Supply Chain Platform";
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", "Explore KisanSetu's services: Direct agricultural marketplace, AI price forecasting, FPO bulk aggregation pools, and live cold chain logistics tracking.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3.5 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Comprehensive Agricultural Services</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            End-to-End Digital Services for Farmers, FPOs, and Bulk Buyers
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-3xl">
            KisanSetu provides a robust suite of digital tools designed to modernize every stage of the agricultural supply chain from farm harvest to retail warehouse delivery.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service 1 */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-sm bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Direct Agricultural Marketplace</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect directly with verified farmers and FPOs. Browse fresh fruits, vegetables, grains, and organic produce with transparent quality grading (Grade A/B/C) and direct bulk procurement.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Verified smallholder listings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Bulk ordering & instant escrow</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Zero intermediary commissions</li>
              </ul>
            </div>
            <button
              onClick={() => setActivePage('marketplace')}
              className="mt-4 w-full py-3 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Browse Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Service 2 */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-sm bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Boxes className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">FPO Bulk Aggregation Pools</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Farmer Producer Organizations can combine harvests from hundreds of smallholder farmers into unified aggregation lots to easily meet large commercial supermarket and processor demand.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Collective bargaining power</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Real-time pool progress tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Automated farmer payout splits</li>
              </ul>
            </div>
            <button
              onClick={() => setActivePage('fpo_pool')}
              className="mt-4 w-full py-3 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View FPO Pools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Service 3 */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-sm bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gemini AI Demand & Price Intelligence</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Harness server-side Gemini AI to forecast regional crop demand surges, analyze Mandi wholesale price trends, and receive optimum price recommendations to maximize profitability.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Predictive demand forecasting</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" /> AI fair price recommendations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Instant multilingual assistant</li>
              </ul>
            </div>
            <button
              onClick={() => setActivePage('farmer_dashboard')}
              className="mt-4 w-full py-3 rounded-sm bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Try AI Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Service 4 */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-sm bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Truck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Cold Chain & GPS Tracking</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Monitor refrigerated transport trucks in real time with live GPS coordinates, estimated time of arrival (ETA), temperature checks, and secure digital delivery handshakes.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Live vehicle GPS coordinates</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Automated milestone updates</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Secure escrow release on delivery</li>
              </ul>
            </div>
            <button
              onClick={() => setActivePage('track_order')}
              className="mt-4 w-full py-3 rounded-sm bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Live Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
