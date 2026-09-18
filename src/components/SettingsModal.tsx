import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Truck,
  Zap,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Store,
  Sprout,
  ShoppingBag,
  Sliders,
  Save,
  RotateCcw,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserSettings, showToast, setIsRoleSelectOpen } = useApp();

  const isFarmer = currentUser?.role === 'farmer';
  const isShopkeeper = currentUser?.role === 'shopkeeper';
  const isConsumer = currentUser?.role === 'consumer';

  const [enableLogistics, setEnableLogistics] = useState(
    currentUser?.enableLogistics !== undefined ? currentUser.enableLogistics : true
  );
  const [enableBulkQuantity, setEnableBulkQuantity] = useState(
    currentUser?.enableBulkQuantity !== undefined ? currentUser.enableBulkQuantity : true
  );

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [businessName, setBusinessName] = useState(
    currentUser?.farmOrBusinessDetails?.farmName ||
    currentUser?.farmOrBusinessDetails?.businessName ||
    ''
  );
  const [city, setCity] = useState(currentUser?.location?.villageOrCity || '');
  const [state, setState] = useState(currentUser?.location?.state || '');
  const [pincode, setPincode] = useState(currentUser?.location?.pincode || '');

  const [isSaving, setIsSaving] = useState(false);

  // Sync state when currentUser changes or modal opens
  useEffect(() => {
    if (currentUser) {
      setEnableLogistics(
        currentUser.enableLogistics !== undefined
          ? currentUser.enableLogistics
          : isConsumer
          ? false
          : true
      );
      setEnableBulkQuantity(
        currentUser.enableBulkQuantity !== undefined
          ? currentUser.enableBulkQuantity
          : isConsumer
          ? false
          : true
      );
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setBusinessName(
        currentUser.farmOrBusinessDetails?.farmName ||
        currentUser.farmOrBusinessDetails?.businessName ||
        ''
      );
      setCity(currentUser.location?.villageOrCity || '');
      setState(currentUser.location?.state || '');
      setPincode(currentUser.location?.pincode || '');
    }
  }, [currentUser, isOpen, isConsumer]);

  if (!isOpen) return null;

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      await updateUserSettings({
        enableLogistics: isConsumer ? false : enableLogistics,
        enableBulkQuantity: isConsumer ? false : enableBulkQuantity,
        name,
        phone,
        location: {
          villageOrCity: city,
          state,
          pincode,
          district: currentUser?.location?.district || city,
        },
        farmOrBusinessDetails: {
          ...(currentUser?.farmOrBusinessDetails || {}),
          ...(isFarmer ? { farmName: businessName } : {}),
          ...(isShopkeeper ? { businessName } : {}),
        },
      });

      showToast('Settings and preferences updated successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to update settings:', err);
      showToast('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="settings-modal-card"
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-colors my-8"
      >
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs text-white ${
                isFarmer
                  ? 'bg-emerald-600'
                  : isShopkeeper
                  ? 'bg-indigo-600'
                  : 'bg-amber-600'
              }`}
            >
              {isFarmer && <Sprout className="w-6 h-6" />}
              {isShopkeeper && <Store className="w-6 h-6" />}
              {isConsumer && <ShoppingBag className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Account Settings
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isFarmer
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : isShopkeeper
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {currentUser?.role || 'Guest'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your service capabilities, logistics, bulk options, and profile.
              </p>
            </div>
          </div>

          <button
            id="btn-close-settings"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. SERVICE CAPABILITIES SECTION (FARMER & SHOPKEEPER ONLY) */}
          {(isFarmer || isShopkeeper) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Optional Service Capabilities</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enable or disable features to customize your dashboard experience.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Logistics Toggle */}
                <div
                  id="card-toggle-logistics"
                  onClick={() => setEnableLogistics(!enableLogistics)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    enableLogistics
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-75'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm shadow-xs">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          enableLogistics
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {enableLogistics ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Logistics & Delivery Support
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Manage delivery options, track shipments, and coordinate with transport partners directly within your dashboard. Disabling this removes logistics widgets for a simplified interface.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <span>Click to {enableLogistics ? 'Turn Off' : 'Turn On'}</span>
                    <div
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        enableLogistics ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          enableLogistics ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Bulk Quantity Toggle */}
                <div
                  id="card-toggle-bulk"
                  onClick={() => setEnableBulkQuantity(!enableBulkQuantity)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    enableBulkQuantity
                      ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-75'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          enableBulkQuantity
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {enableBulkQuantity ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Bulk Quantity & Wholesale Orders
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      List products in larger quantities (100kg+), set minimum order sizes (MOQ), and offer tier discounts for bulk buyers. Disabling this removes bulk features from your dashboard.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    <span>Click to {enableBulkQuantity ? 'Turn Off' : 'Turn On'}</span>
                    <div
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        enableBulkQuantity ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          enableBulkQuantity ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Consumer Notice */}
          {isConsumer && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Consumer Account Status</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                As a consumer, your dashboard is dedicated to buying farm-fresh produce and kirana groceries with doorstep delivery and real-time tracking. Logistics management and bulk seller options are not required for consumer shopping accounts.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsRoleSelectOpen(true);
                }}
                className="mt-1 text-xs font-extrabold text-amber-900 dark:text-amber-200 underline cursor-pointer hover:text-amber-700"
              >
                Want to sell? Switch role to Farmer or Shopkeeper &rarr;
              </button>
            </div>
          )}

          {/* 2. PROFILE & LOCATION DETAILS */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Profile & Location Details</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Name / Contact Person
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {(isFarmer || isShopkeeper) && (
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {isFarmer ? 'Farm / Enterprise Name' : 'Store / Kirana Name'}
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  City / Village
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Hyper-Scale Shard ID
                </label>
                <input
                  type="text"
                  value={currentUser?.shardId || 'SHARD-001 (Active)'}
                  readOnly
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={() => {
              onClose();
              setIsRoleSelectOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Switch Role (3 Sections)</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
