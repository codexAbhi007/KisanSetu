import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_FPO_POOLS } from '../data/mockData';
import { Boxes, Users, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const FPOCollaborationPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-emerald-900 dark:bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-3 border border-emerald-800 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 dark:text-emerald-400 bg-emerald-800 dark:bg-emerald-950 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
            Farmer Producer Organization (FPO) Aggregation
          </span>
          <h1 className="text-3xl font-extrabold">Collective Bargaining & Bulk Aggregation Pools</h1>
          <p className="text-emerald-100 dark:text-slate-300 text-sm max-w-2xl">
            Smallholder farmers combine their harvest into FPO aggregation pools to meet large bulk buyer orders, reducing logistics costs and increasing bargaining power.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_FPO_POOLS.map((pool) => (
            <div key={pool.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-lg">
                    {pool.status.replace('_', ' ')}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mt-2">{pool.productName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{pool.fpoName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">Aggregation Target</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-base">{pool.totalAggregatedKg} / {pool.targetBuyerDemandKg} kg</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Progress</span>
                  <span>{Math.round((pool.totalAggregatedKg / pool.targetBuyerDemandKg) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${(pool.totalAggregatedKg / pool.targetBuyerDemandKg) * 100}%` }}
                  />
                </div>
              </div>

              {/* Participating farmers */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Participating Smallholder Farmers ({pool.participatingFarmersCount})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                  {pool.farmers.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{f.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 block">Village: {f.village}</span>
                      </div>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{f.quantityKg} kg</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActivePage('marketplace')}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Procure FPO Pool Lot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
