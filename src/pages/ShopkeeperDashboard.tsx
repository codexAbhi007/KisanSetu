import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Store,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Search,
  Plus,
  Truck,
  ArrowRight,
  CheckCircle2,
  Edit3,
  Trash2,
  Sparkles,
  DollarSign,
  Percent,
  Settings,
  Sliders,
  Zap,
  Navigation,
  Phone,
  ChevronRight,
} from 'lucide-react';
import { ProductEditorModal } from '../components/ProductEditorModal';
import { SessionVerificationBanner } from '../components/SessionVerificationBanner';

export const ShopkeeperDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    orders,
    createOrder,
    deleteProduct,
    showToast,
    setActivePage,
    setIsSettingsOpen,
  } = useApp();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'marketplace' | 'inventory' | 'orders' | 'suppliers' | 'logistics' | 'bulk'
  >('overview');

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

  useEffect(() => {
    document.title = "Shopkeeper Dashboard | KisanSetu";
  }, []);

  useEffect(() => {
    if (!isLogisticsEnabled && activeTab === 'logistics') {
      setActiveTab('overview');
    }
    if (!isBulkEnabled && activeTab === 'bulk') {
      setActiveTab('overview');
    }
  }, [isLogisticsEnabled, isBulkEnabled, activeTab]);

  const shopkeeperProducts = products.filter((p) => p.sellerType === 'shopkeeper');
  const directFarmerProducts = products.filter((p) => p.sellerType === 'farmer');

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

  const handleRestock = (prod: Product, qty: number) => {
    if (!qty || qty <= 0) {
      showToast('Please enter a valid quantity to restock.');
      return;
    }
    createOrder(prod.id, qty, (currentUser?.location?.villageOrCity || 'Pune') + ' Retail Store');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 hidden lg:flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              🏪
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">
                {currentUser?.name || 'Sharma Fresh Mart'}
              </span>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                Kirana Retailer Portal
              </span>
            </div>
          </div>

          <nav className="space-y-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3.5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full text-left px-3.5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Store Inventory ({shopkeeperProducts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`w-full text-left px-3.5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Direct Sourcing</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-3.5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Purchase Orders ({orders.length})</span>
            </button>

            {/* CONDITIONAL TAB: Logistics & Transport Fleet */}
            {isLogisticsEnabled && (
              <button
                onClick={() => setActiveTab('logistics')}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'logistics'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Delivery & Fleet</span>
              </button>
            )}

            {/* CONDITIONAL TAB: Bulk Quantity & Wholesale Lots */}
            {isBulkEnabled && (
              <button
                onClick={() => setActiveTab('bulk')}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'bulk'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Bulk & Wholesale</span>
              </button>
            )}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 text-xs font-mono text-slate-500 space-y-3">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold transition-colors flex items-center gap-2.5 text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/80 cursor-pointer shadow-xs"
            title="Adjust logistics and bulk toggles in settings"
          >
            <Settings className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Settings & Toggles</span>
          </button>

          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified 30-Min Hub</span>
          </div>
          <p className="text-[11px] text-slate-400">KisanSetu B2B Sourcing v2.4</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {/* Active Session Verification Banner */}
        <SessionVerificationBanner portalRole="shopkeeper" portalTitle="🏪 Shopkeeper Section (Kirana Mart)" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-indigo-200 dark:border-indigo-800">
                <span>B2B SHOPKEEPER & KIRANA TERMINAL</span>
              </div>

              {/* Dynamic status badges */}
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                  isLogisticsEnabled
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                }`}
              >
                <Truck className="w-3 h-3" />
                <span>{isLogisticsEnabled ? 'Logistics: Active' : 'Logistics: Off'}</span>
              </span>

              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                  isBulkEnabled
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>{isBulkEnabled ? 'Bulk Lots: Active' : 'Bulk Lots: Off'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome, {currentUser?.name || 'Sharma Fresh Mart'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Manage your local retail pantry, edit selling prices & stock, or procure directly from verified farmers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-shopkeeper-header-settings"
              onClick={() => setIsSettingsOpen(true)}
              className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors border border-slate-300 dark:border-slate-700 flex items-center gap-2 cursor-pointer shadow-xs"
              title="Toggle Logistics and Bulk Quantity in Settings"
            >
              <Settings className="w-4 h-4 text-amber-500" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Store Item</span>
            </button>
          </div>
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">MONTHLY PURCHASES</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹1,84,200</p>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">14% lower vs traditional traders</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">INVENTORY VALUE</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  ₹{shopkeeperProducts.reduce((acc, p) => acc + p.quantityAvailableKg * p.pricePerKg, 0).toLocaleString()}
                </p>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                  {shopkeeperProducts.length} active retail items
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">ACTIVE ORDERS</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{orders.length} Shipments</p>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">Escrow secured in Cloud</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">AVG PROFIT MARGIN</span>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">26.8%</p>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">Direct from source</span>
              </div>
            </div>

            {/* AI Procurement Assistant Alert */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-indigo-50 p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-indigo-800/40">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-indigo-800/80 text-indigo-200 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border border-indigo-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI PROCUREMENT ADVISORY</span>
                </div>
                <h2 className="text-xl font-bold text-white">Weekend Demand Surge Expected for Tomatoes & Onions</h2>
                <p className="text-xs text-indigo-200 leading-relaxed max-w-2xl">
                  Local household orders in your 5 km radius are projected to jump 28% over Saturday-Sunday. Direct farmer sourcing from Nashik APMC saves ₹6/kg compared to local mandi wholesalers.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shrink-0 cursor-pointer"
              >
                Source from Farmers
              </button>
            </div>

            {/* Store Inventory Overview Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-0 transition-colors">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Store Pantry & Inventory</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live products in your store available for customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Item</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Full Inventory Page →
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400 uppercase">
                      <th className="p-4">Produce Name</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Purchase Price</th>
                      <th className="p-4">Retail Price</th>
                      <th className="p-4">Profit Margin</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                    {shopkeeperProducts.map((item) => {
                      const purchase = item.purchasePrice || Math.round(item.pricePerKg * 0.75);
                      const marginAmt = item.pricePerKg - purchase;
                      const marginPct = Math.round((marginAmt / item.pricePerKg) * 100);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="block font-bold text-slate-900 dark:text-white">{item.name}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ID: {item.id}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono">
                              {item.quantityAvailableKg} kg
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-400 font-mono font-medium">₹{purchase}/kg</td>
                          <td className="p-4 text-slate-900 dark:text-white font-mono font-extrabold text-sm">₹{item.pricePerKg}/kg</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                                marginPct >= 20
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                              }`}
                            >
                              +{marginPct}% (₹{marginAmt}/kg)
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl text-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setProductToDelete(item)}
                              className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Conditional Overview Cards for Logistics & Bulk */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logistics Overview Card */}
              {isLogisticsEnabled ? (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                      <Truck className="w-4 h-4" />
                      <span>30-MIN LOGISTICS & FLEET</span>
                    </div>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Neighborhood Express & Courier Dispatches
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    1 rider currently out for delivery (ETA 9 mins). Inbound produce truck arriving in 32 mins from Nashik Hub.
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('logistics')}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Fleet & Dispatches</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="text-[11px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Settings ⚙️
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-bold text-xs">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>LOGISTICS IS MUTED</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono">In-Store Mode</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Logistics features are currently turned off for your store. Customers only do direct in-person walk-in purchases.
                  </p>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Enable 30-min Delivery in Settings →
                  </button>
                </div>
              )}

              {/* Bulk Wholesale Overview Card */}
              {isBulkEnabled ? (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                      <Zap className="w-4 h-4" />
                      <span>BULK & WHOLESALE LOTS</span>
                    </div>
                    <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    B2B Minimum Orders & Volume Discounts
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    MOQ tiers active (25kg, 50kg, 100kg+) for neighborhood restaurants and catering events with up to 15% discount.
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('bulk')}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Configure Wholesale Tiers</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="text-[11px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Settings ⚙️
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-bold text-xs">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>BULK QUANTITY IS MUTED</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono">Retail Only</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Bulk selling & wholesale MOQs are turned off. Your store currently lists individual household consumer retail packs.
                  </p>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Enable Wholesale Lots in Settings →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Store Inventory */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Full Store Inventory & Pricing Manager</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Add, edit, or delete items sold to consumers in your 30-minute neighborhood radius.
                </p>
              </div>
              <button
                onClick={handleOpenAdd}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Store Item</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400 uppercase">
                    <th className="p-4">Item Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Available Stock</th>
                    <th className="p-4">Purchase Price</th>
                    <th className="p-4">Retail Price</th>
                    <th className="p-4">Profit Margin</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                  {shopkeeperProducts.map((item) => {
                    const purchase = item.purchasePrice || Math.round(item.pricePerKg * 0.75);
                    const marginAmt = item.pricePerKg - purchase;
                    const marginPct = Math.round((marginAmt / item.pricePerKg) * 100);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="block font-bold text-slate-900 dark:text-white">{item.name}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">ID: {item.id}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-semibold">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-indigo-700 dark:text-indigo-400">{item.quantityAvailableKg} kg</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">₹{purchase}/kg</td>
                        <td className="p-4 text-slate-900 dark:text-white font-extrabold text-sm">₹{item.pricePerKg}/kg</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              marginPct >= 20
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            +{marginPct}% (₹{marginAmt}/kg)
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setProductToDelete(item)}
                            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Marketplace / Direct Sourcing */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Direct Farmer & FPO Sourcing Marketplace</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Procure farm-fresh harvests in bulk directly from verified producers at mandi-benchmarked prices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {directFarmerProducts.map((prod) => (
                <div key={prod.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between transition-colors">
                  <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase shadow-sm">
                      {prod.qualityGrade || 'Grade A'}
                    </span>
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                          {prod.category}
                        </span>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{prod.location}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{prod.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Farmer: <span className="font-bold text-slate-900 dark:text-white">{prod.sellerName}</span></p>
                      <div className="flex items-baseline justify-between pt-2">
                        <div>
                          <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹{prod.pricePerKg}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono"> / kg</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">{prod.quantityAvailableKg.toLocaleString()} kg avail</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={prod.minOrderKg || 10}
                          defaultValue={prod.minOrderKg || 50}
                          id={`qty-${prod.id}`}
                          className="w-24 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold text-center"
                        />
                        <button
                          onClick={() => {
                            const inputEl = document.getElementById(`qty-${prod.id}`) as HTMLInputElement;
                            const qty = inputEl ? parseInt(inputEl.value) || prod.minOrderKg : prod.minOrderKg;
                            createOrder(prod.id, qty, (currentUser?.location?.villageOrCity || 'Pune') + ' Retail Store');
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                        >
                          Bulk Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Purchase Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Purchase Orders & Shipments</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Track your direct wholesale orders from farm gates to your retail store.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-mono text-slate-500 dark:text-slate-400 uppercase">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Tracking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">{o.id}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{o.productName}</td>
                      <td className="p-4">{o.quantityKg} kg</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">₹{o.total.toLocaleString()}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase text-[10px]">
                          {o.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setActivePage('track_order');
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl uppercase text-[10px] cursor-pointer"
                        >
                          Live GPS Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Logistics & Fleet Management (Rendered when enableLogistics is true) */}
        {activeTab === 'logistics' && isLogisticsEnabled && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Store Logistics & Transport Fleet</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Delivery Options & Transport Coordination
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Manage neighborhood express delivery, track live rider dispatches, and coordinate inbound farm trucks.
                </p>
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer self-start sm:self-auto"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-500" />
                <span>Logistics Settings</span>
              </button>
            </div>

            {/* Delivery Methods Offered to Customers */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Customer Delivery Options Supported:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border-2 border-emerald-500/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">⚡</span>
                    <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">30-Minute Neighborhood Express</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dispatched via dedicated KisanSetu E-Bike partners within 4 km of your Kirana.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🕒</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Scheduled</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Slot-Based Evening Batch</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Grouped drop-offs between 6:00 PM and 8:30 PM for household grocery baskets.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🏬</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Zero Transit</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">In-Store Counter Pickup</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Customer orders ahead on KisanSetu app and picks up parcel directly at the checkout counter.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Rider Fleet & Live Dispatches */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Active Fleet & Transport Partners</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live telematics and rider dispatch status for your retail outlet.</p>
                </div>
                <button
                  onClick={() => {
                    showToast('Dispatching next delivery batch to nearby courier partner...');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Dispatch New Order</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rider Card 1 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                        🛵
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Santosh Shinde</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">E-Bike #MH-12-RD-4102</div>
                      </div>
                    </div>
                    <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      Delivering (2 drops)
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Current Drop:</span>
                      <span className="font-bold text-slate-900 dark:text-white">Koregaon Park Lane 4 (Order #ORD-7712)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ETA to customer:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">9 mins</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => showToast('Calling driver Santosh Shinde (+91 98234-99120)...')}
                      className="flex-1 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Call Rider</span>
                    </button>
                    <button
                      onClick={() => setActivePage('track_order')}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Live GPS Map</span>
                    </button>
                  </div>
                </div>

                {/* Inbound Truck Card 2 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        🚚
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Inbound Farm Transit</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Tata Ace #MH-15-EC-9012</div>
                      </div>
                    </div>
                    <span className="bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      In Transit
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Produce Cargo:</span>
                      <span className="font-bold text-slate-900 dark:text-white">1,500kg Wheat & Tomatoes (Nashik Hub)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Store Arrival:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">32 mins</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => showToast('Calling fleet driver Jagdish Kumar (+91 98234-11029)...')}
                      className="flex-1 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Call Driver</span>
                    </button>
                    <button
                      onClick={() => showToast('Inward loading dock notified!')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Prepare Dock</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Bulk Quantity & Wholesale Lots (Rendered when enableBulkQuantity is true) */}
        {activeTab === 'bulk' && isBulkEnabled && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-800">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Kirana Bulk Quantity & Wholesale Lots</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Wholesale Order Minimums (MOQ) & Volume Discounts
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  List larger quantities, configure minimum order sizes, and offer bulk discounts to local cafes, caterers, and restaurants.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bulk Settings</span>
                </button>
                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ List Bulk Store Lot</span>
                </button>
              </div>
            </div>

            {/* Wholesale Tier Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase">Tier 1 • Cafe / Canteen</span>
                  <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full">4% OFF</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">25 kg – 49 kg</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ideal for neighborhood chai stalls, street food vendors, and local hostels.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase">Tier 2 • Restaurant</span>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">8% OFF</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">50 kg – 99 kg</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Popular for multi-cuisine restaurants, cloud kitchens, and bakeries.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase">Tier 3 • Caterer / Event</span>
                  <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 text-[10px] font-black px-2 py-0.5 rounded-full">15% OFF</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">100+ kg (Full Sacks)</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Designed for wedding catering contractors and institutional mess orders.
                </p>
              </div>
            </div>

            {/* Direct Farm Sourcing in Bulk */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-900/60 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg">Direct Farmer Mandi Sourcing in Bulk Lots</h3>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                As a shopkeeper with Bulk Quantity enabled, you can procure entire 100kg - 1000kg farm sacks directly from Nashik, Pune, and Satara growers at zero-middleman APMC rates.
              </p>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
              >
                Browse Farmer Bulk Lots →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Product Editor Modal (Add & Edit) */}
      <ProductEditorModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create', product: null })}
        mode={modalState.mode}
        role="shopkeeper"
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
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete Store Item?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Are you sure you want to remove <strong>"{productToDelete.name}"</strong> from your store pantry? It will be deleted from your inventory immediately.
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
