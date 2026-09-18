import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Sprout,
  DollarSign,
  Package,
  TrendingUp,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  BarChart3,
  MapPin,
  Edit3,
  Trash2,
  AlertTriangle,
  Truck,
  Zap,
  Settings,
  Phone,
  Navigation,
  Layers,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ProductEditorModal } from '../components/ProductEditorModal';
import { SessionVerificationBanner } from '../components/SessionVerificationBanner';

export const FarmerDashboard: React.FC = () => {
  const { currentUser, products, deleteProduct, setIsSettingsOpen, showToast } = useApp();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    product: Product | null;
  }>({
    isOpen: false,
    mode: 'create',
    product: null,
  });

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Feature flags controlled by Settings and registration
  const isLogisticsEnabled = currentUser?.enableLogistics !== false;
  const isBulkEnabled = currentUser?.enableBulkQuantity !== false;

  // Filter farmer listings
  const farmerProducts = products.filter((p) => p.sellerType === 'farmer');

  // Interactive delivery option state for farmer dispatches
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<'farm_gate' | 'eloader' | 'cold_chain'>('eloader');
  const [isDispatching, setIsDispatching] = useState(false);

  const earningsData = [
    { month: 'Apr', earnings: 45000 },
    { month: 'May', earnings: 52000 },
    { month: 'Jun', earnings: 48000 },
    { month: 'Jul', earnings: 61000 },
    { month: 'Aug', earnings: 78500 },
  ];

  const handleOpenAdd = () => {
    setModalState({ isOpen: true, mode: 'create', product: null });
  };

  const handleOpenEdit = (p: Product) => {
    setModalState({ isOpen: true, mode: 'edit', product: p });
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Active Session Verification Banner */}
        <SessionVerificationBanner portalRole="farmer" portalTitle="🌾 Farmer Section (Producer)" />

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-800/60 dark:border-slate-800">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Verified Farmer & FPO Portal
              </span>
              <span className="text-xs text-emerald-300 font-mono">Nashik Hub, Maharashtra</span>

              {/* Dynamic Feature Status Tags */}
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                  isLogisticsEnabled
                    ? 'bg-emerald-800 text-emerald-200 border border-emerald-600'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <Truck className="w-3 h-3" />
                <span>{isLogisticsEnabled ? 'Logistics: Enabled' : 'Logistics: Disabled'}</span>
              </span>

              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                  isBulkEnabled
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>{isBulkEnabled ? 'Bulk Lots: Enabled' : 'Bulk Lots: Disabled'}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name || 'Kisan Partner'}!
            </h1>
            <p className="text-emerald-100 dark:text-slate-300 text-sm max-w-2xl">
              Your direct listings are live. Maintain produce databases, manage dispatch logistics, and configure wholesale lots.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn-farmer-settings"
              onClick={() => setIsSettingsOpen(true)}
              className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
              title="Toggle Logistics and Bulk Quantity in Settings"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              <span>+ List New Produce</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Monthly Earnings</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">₹78,500</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18% vs last month (Direct pricing)
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Listings</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{farmerProducts.length} Items</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Live in national marketplace</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Completed Orders</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">24 Shipments</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">100% Escrow Settled</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">AI Price Confidence</span>
            <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">91%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Optimal selling window</span>
          </div>
        </div>

        {/* AI Recommendations & Earnings Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Earnings Chart */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Farmer Earnings Growth (₹)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Direct marketplace realization compared to traditional middlemen.</p>
              </div>
              <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                    }}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Price Recommendation Widget */}
          <div className="lg:col-span-4 bg-emerald-950 dark:bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-800 dark:border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">AI Price Intelligence</h3>
              </div>
              <p className="text-xs text-emerald-200 dark:text-slate-300 leading-relaxed">
                Based on current wholesale indices in Kolkata & Delhi, your Grade A Tomatoes can command higher direct prices.
              </p>

              <div className="bg-emerald-900/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-emerald-800 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between text-emerald-300 dark:text-slate-300">
                  <span>Recommended Range:</span>
                  <span className="font-bold text-white">₹26 – ₹29 / kg</span>
                </div>
                <div className="flex justify-between text-emerald-300 dark:text-slate-300">
                  <span>Market Demand:</span>
                  <span className="font-bold text-emerald-400">High (89% confidence)</span>
                </div>
                <div className="flex justify-between text-emerald-300 dark:text-slate-300">
                  <span>Best Selling Window:</span>
                  <span className="font-bold text-white">Next 3 to 5 days</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenAdd}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              List New Item with AI Verification
            </button>
          </div>
        </div>

        {/* LOGISTICS & DELIVERY FLEET COORDINATION (Shown when enableLogistics is true) */}
        {isLogisticsEnabled ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Farm Logistics & Transport Partner Fleet</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Delivery Options & Live Shipments
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Coordinate transport partners, choose delivery methods, and monitor real-time vehicle dispatch.
                </p>
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="self-start sm:self-auto text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold flex items-center gap-1.5 cursor-pointer"
                title="Adjust logistics preference in settings"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure in Settings</span>
              </button>
            </div>

            {/* Delivery Mode Selector */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Active Farm Delivery Modes:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setSelectedDeliveryMode('farm_gate')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedDeliveryMode === 'farm_gate'
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🏡</span>
                    {selectedDeliveryMode === 'farm_gate' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Farm Gate Self-Pickup</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Buyer arranges their own transport. Zero transit cost to farmer.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedDeliveryMode('eloader')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedDeliveryMode === 'eloader'
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🛺</span>
                    {selectedDeliveryMode === 'eloader' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Local E-Loader / Tempo (Tata Ace)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Direct farm-to-shop drop within 45 km radius. Automated GPS route.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedDeliveryMode('cold_chain')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedDeliveryMode === 'cold_chain'
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">❄️</span>
                    {selectedDeliveryMode === 'cold_chain' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Reefer Cold-Chain Truck</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Inter-city transit with 4°C - 12°C active cooling for fresh vegetables & dairy.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Transport Partner Dispatch Tracker */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Live Shipment #TR-8821
                      </span>
                      <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        In Transit
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      1,500kg Sharbati Wheat & Nashik Tomatoes → Destination: Koregaon Kirana Hub
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showToast?.('Calling transport driver Jagdish Kumar (+91 98234-11029)...');
                    }}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Call Driver</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDispatching(true);
                      setTimeout(() => {
                        setIsDispatching(false);
                        showToast?.('Pickup requested from nearest Agri-Logistics Hub!');
                      }, 1200);
                    }}
                    disabled={isDispatching}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{isDispatching ? 'Scheduling...' : 'Request Partner Pickup'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Tracker Bar */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  <span>Farm Gate (Nashik)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">ETA: 32 Mins (On Highway)</span>
                  <span>Kirana Buyer Store</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[65%] rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Simplified banner when Logistics is disabled */
          <div className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Logistics Support Disabled:</strong> All your produce listings are currently set for direct farm gate pickup. You can enable transport partner coordination anytime.
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline shrink-0 cursor-pointer"
            >
              Enable in Settings →
            </button>
          </div>
        )}

        {/* BULK QUANTITY & WHOLESALE LOTS (Shown when enableBulkQuantity is true) */}
        {isBulkEnabled ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-800">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Bulk Quantity & Wholesale Mandi Lots</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Volume Pricing & Minimum Order Sizes (MOQ)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  List harvest in bulk quantities, attract wholesale kirana buyers, and configure automated volume discount tiers.
                </p>
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="self-start sm:self-auto text-xs text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 font-bold flex items-center gap-1.5 cursor-pointer"
                title="Adjust bulk quantity preference in settings"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure in Settings</span>
              </button>
            </div>

            {/* Volume Discount Tiers Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase">Tier 1 • Medium Lots</span>
                  <span className="bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full">5% OFF</span>
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white">100 kg – 499 kg</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Suitable for independent Kirana stores and neighborhood supermarket restocks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase">Tier 2 • Large Lots</span>
                  <span className="bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">12% OFF</span>
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white">500 kg – 999 kg</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tailored for community kitchens, wedding caterers, and wholesale distributors.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase">Tier 3 • Full Mandi Load</span>
                  <span className="bg-indigo-200 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-200 text-[10px] font-black px-2 py-0.5 rounded-full">20% OFF</span>
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white">1,000+ kg (1+ Ton)</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct truckload procurement by food processing units and national FPO pools.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Want to list a dedicated harvest as a wholesale lot?
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Bulk listings appear in the B2B Mandi section with minimum order quantity (MOQ) enforcement.
                </p>
              </div>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                + Create Bulk Lot
              </button>
            </div>
          </div>
        ) : (
          /* Simplified banner when Bulk Quantity is disabled */
          <div className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Bulk Quantity Listings Disabled:</strong> You are currently listing produce strictly in standard retail quantities. You can enable wholesale lots and volume discounts anytime.
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-amber-700 dark:text-amber-400 font-bold hover:underline shrink-0 cursor-pointer"
            >
              Enable in Settings →
            </button>
          </div>
        )}

        {/* My Active Listings Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-0 transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">My Active Farm Listings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You can add, edit harvest prices/quantities, or delete your produce items in real-time.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Produce</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">Produce Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Quantity Available</th>
                  <th className="p-4">Price / kg</th>
                  <th className="p-4">Quality Grade</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {farmerProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-white text-sm">{p.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ID: {p.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">
                      {p.quantityAvailableKg.toLocaleString()} kg
                    </td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white text-sm">₹{p.pricePerKg}</td>
                    <td className="p-4">
                      <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {p.qualityGrade || 'Grade A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Live in Marketplace
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-xs"
                        title="Edit listing"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setProductToDelete(p)}
                        className="p-2 bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-xs"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Editor Modal (Add / Edit) */}
      <ProductEditorModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create', product: null })}
        mode={modalState.mode}
        role="farmer"
        initialProduct={modalState.product}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete Produce Listing?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Are you sure you want to remove <strong>"{productToDelete.name}"</strong>? This will remove it from the KisanSetu direct marketplace and Cloud Database immediately.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-colors shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

