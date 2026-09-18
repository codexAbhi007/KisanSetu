import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Boxes, Search, ShieldCheck, MapPin, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';

export const BulkMarketplacePage: React.FC = () => {
  const { products, setActivePage, createOrder, setSelectedProductId, globalSearchQuery } = useApp();
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery);
  const [minQtyFilter, setMinQtyFilter] = useState(50);

  // Reflect the Navbar's global mega-search when arriving on this page
  useEffect(() => {
    setSearchQuery(globalSearchQuery);
  }, [globalSearchQuery]);

  // Filter products suitable for bulk (farmers listing bulk quantities)
  const bulkProducts = products.filter((p) => {
    const isBulk = p.quantityAvailableKg >= 100;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return isBulk && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 font-sans transition-colors">
      {/* Header */}
      <section className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 dark:from-slate-950 dark:via-sky-950 dark:to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-sky-800/80 dark:bg-sky-900/80 text-sky-200 px-3 py-1 rounded-full text-xs font-mono font-bold">
            <Boxes className="w-4 h-4 text-sky-300" />
            <span>B2B Farmer → Shopkeeper Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Wholesale Bulk Produce Sourcing
          </h1>
          <p className="text-sky-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            Shopkeepers, FPOs, and retailers can source certified farm produce in bulk quantities with tiered wholesale pricing and escrow security.
          </p>

          <div className="pt-4 max-w-2xl">
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-xl border border-sky-700 dark:border-sky-800">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bulk tomatoes (1000kg), onions, basmati rice..."
                className="w-full px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none bg-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verified Farmer Bulk Lots ({bulkProducts.length})
          </h2>
          <span className="text-xs font-mono bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-3 py-1 rounded-full font-bold">
            Escrow Protected & Quality Graded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bulkProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-mono px-2.5 py-1 rounded-md font-bold shadow-md">
                    🌾 VERIFIED FARMER
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {prod.location}</span>
                    <span className="bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-mono px-2 py-0.5 rounded font-bold">
                      Grade: {prod.qualityGrade || 'Grade A'}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{prod.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Farmer: <strong className="text-slate-900 dark:text-white">{prod.sellerName}</strong> ({prod.fpoName || 'Independent'})</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Available Stock:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{prod.quantityAvailableKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Wholesale Price:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">₹{prod.pricePerKg}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Min Bulk Order:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{prod.minOrderKg || 50} kg</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    createOrder(prod.id, prod.minOrderKg || 100, 'Shop Delivery Warehouse, Pune');
                    setActivePage('track_order');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Bulk Order (Escrow)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedProductId(prod.id);
                    setActivePage('product_detail');
                  }}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  View Lot Details & Traceability
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
