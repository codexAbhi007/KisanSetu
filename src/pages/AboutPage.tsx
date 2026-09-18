import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, ShieldCheck, Users, Target, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useApp();

  useEffect(() => {
    document.title = "About KisanSetu | Direct Agricultural Marketplace & FPO Platform";
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", "Learn about KisanSetu, an AI-powered direct agricultural marketplace designed to eliminate middlemen, increase smallholder farmer realization, and empower FPOs.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3.5 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-widest border border-indigo-200 dark:border-indigo-800">
            <Sprout className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Smart India Hackathon 2026 Initiative</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About KisanSetu: Bridging Farmers and Bulk Markets Directly
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-3xl">
            KisanSetu is a next-generation AI-powered agricultural supply chain platform engineered to connect smallholder farmers and Farmer Producer Organizations (FPOs) directly with bulk buyers, supermarkets, and food processors.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <div className="w-12 h-12 rounded-sm bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Core Mission</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              To eliminate 4–6 layers of traditional intermediaries, reduce post-harvest food waste by 25%, and increase smallholder farmer income realization by up to 50% through transparent digital procurement and AI-driven price recommendations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <div className="w-12 h-12 rounded-sm bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trust & Transparency</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every transaction on KisanSetu is backed by secure escrow payment release upon delivery confirmation, verified farmer credentials, and real-time GPS tracking across major agricultural corridors.
            </p>
          </div>
        </div>

        {/* Key Pillars */}
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 transition-colors">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Why KisanSetu Matters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">PILLAR_01</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Direct FPO Aggregation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Smallholder farmers pool their harvests into FPO aggregation lots to easily fulfill large commercial supermarket orders.
              </p>
            </div>
            <div className="p-6 rounded-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">PILLAR_02</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Gemini AI Intelligence</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Real-time demand forecasting and fair price recommendations based on Mandi wholesale indices and regional weather data.
              </p>
            </div>
            <div className="p-6 rounded-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">PILLAR_03</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Cold Chain Logistics</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Optimized route planning and live GPS tracking ensuring fresh produce delivery from farm gates to destination warehouses.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 dark:bg-slate-900 border dark:border-slate-800 text-white p-8 sm:p-12 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Ready to experience transparent agricultural trade?</h2>
            <p className="text-slate-400 text-sm">Explore our marketplace or connect with our team today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActivePage('marketplace')}
              className="px-6 py-3 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="px-6 py-3 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
