import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Database, Server, Truck, Zap } from 'lucide-react';
import { generateHyperScaleId } from '../config/hyperScaleEngine';

export const RegisterShopkeeperPage: React.FC = () => {
  const { setActivePage, registerDirectProfile, showToast } = useApp();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    ownerName: 'Sharma Fresh Mart',
    phone: '+91 98111 22334',
    email: 'sharma.store@kisansetu.in',
    shopName: 'Sharma Fresh Mart & Vegetables',
    shopType: 'Retail Grocery Store',
    address: 'Ballygunge Market, Stall 14',
    state: 'West Bengal',
    district: 'Kolkata',
    city: 'Kolkata',
    pincode: '700019',
    businessRegNo: 'WB-RET-2024-8891',
    gstin: '19AAACS8891K1Z8',
    yearsInBusiness: '8 Years',
    employeeCount: '5 Employees',
    productsRequired: 'Tomatoes, Onions, Potatoes, Leafy Greens',
    monthlyRequirement: '2,500 kg',
    preferredPriceRange: 'Wholesale Mandi Parity',
    deliveryFrequency: 'Daily Early Morning',
    enableLogistics: true,
    enableBulkQuantity: true,
  });

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleComplete = async () => {
    const { uid, shardId, partition } = generateHyperScaleId('shopkeeper', formData.state);

    await registerDirectProfile({
      uid,
      name: formData.shopName,
      email: formData.email,
      phone: formData.phone,
      role: 'shopkeeper',
      status: 'active',
      enableLogistics: formData.enableLogistics,
      enableBulkQuantity: formData.enableBulkQuantity,
      location: {
        state: formData.state,
        district: formData.district,
        villageOrCity: formData.city,
        pincode: formData.pincode,
      },
      farmOrBusinessDetails: {
        businessName: formData.shopName,
        businessType: formData.shopType,
      },
      rating: 4.8,
      verified: true,
      createdAt: new Date().toISOString(),
      shardId,
      partitionCluster: partition,
    });

    showToast(`Shopkeeper verified on 500-Crore Hyper-Scale Partition (${shardId})!`);
    setActivePage('shopkeeper_dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header & Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActivePage('auth_shopkeeper')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shopkeeper Login</span>
            </button>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-sm border border-indigo-200 dark:border-indigo-800">
              STEP {step} OF 6
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded">
                PLANETARY CAPACITY: 500 CRORE SHOPS
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">128-bit Collision-Free ID</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Shopkeeper & Retailer Onboarding</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Register your store on the 500-Crore Hyper-Scale Grid to source fresh produce directly from farmers with automated reorder alerts.
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Owner Information</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Provide store owner contact details.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Owner Full Name *</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleChange('ownerName', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Business Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Shop & Store Information</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Where is your retail shop or restaurant located?</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Shop Name *</label>
                  <input
                    type="text"
                    value={formData.shopName}
                    onChange={(e) => handleChange('shopName', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Shop Type *</label>
                  <input
                    type="text"
                    value={formData.shopType}
                    onChange={(e) => handleChange('shopType', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Street Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">District / City *</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">PIN Code *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Business Registration & Credentials</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Provide official shop registration and tax IDs.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Business Reg. Number *</label>
                  <input
                    type="text"
                    value={formData.businessRegNo}
                    onChange={(e) => handleChange('businessRegNo', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">GSTIN (if applicable)</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => handleChange('gstin', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Years in Business</label>
                  <input
                    type="text"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleChange('yearsInBusiness', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Number of Employees</label>
                  <input
                    type="text"
                    value={formData.employeeCount}
                    onChange={(e) => handleChange('employeeCount', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Purchasing Requirements</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">What produce quantities do you typically require?</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Products Required *</label>
                  <input
                    type="text"
                    value={formData.productsRequired}
                    onChange={(e) => handleChange('productsRequired', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Average Monthly Requirement</label>
                    <input
                      type="text"
                      value={formData.monthlyRequirement}
                      onChange={(e) => handleChange('monthlyRequirement', e.target.value)}
                      className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Delivery Frequency</label>
                    <input
                      type="text"
                      value={formData.deliveryFrequency}
                      onChange={(e) => handleChange('deliveryFrequency', e.target.value)}
                      className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Delivery Preferences & Service Capabilities</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure delivery receipt options and opt-in store features.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Receiving Address / Stall Number</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Preferred Delivery Time Window</label>
                  <input
                    type="text"
                    value="Early Morning (5:00 AM - 8:00 AM)"
                    readOnly
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* Optional Service Capabilities Toggles for Shopkeeper */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Store Capabilities (Opt-in Options)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tailor your shopkeeper dashboard modules. You can change these anytime in Settings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {/* Logistics Toggle Card */}
                    <div
                      onClick={() => handleChange('enableLogistics', !formData.enableLogistics)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        formData.enableLogistics
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-75'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs">
                            <Truck className="w-4 h-4" />
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              formData.enableLogistics
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {formData.enableLogistics ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Logistics & Home Delivery</h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          Coordinate customer home deliveries, track delivery fleets, and coordinate inbound supplier dispatches.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">
                        <span>Click to {formData.enableLogistics ? 'Disable' : 'Enable'}</span>
                        <div
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                            formData.enableLogistics ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              formData.enableLogistics ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bulk Quantity Toggle Card */}
                    <div
                      onClick={() => handleChange('enableBulkQuantity', !formData.enableBulkQuantity)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        formData.enableBulkQuantity
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
                              formData.enableBulkQuantity
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {formData.enableBulkQuantity ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bulk Quantity & Wholesale</h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          List wholesale sacks/crates, set minimum orders for restaurants & caterers, and offer bulk discounts.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                        <span>Click to {formData.enableBulkQuantity ? 'Disable' : 'Enable'}</span>
                        <div
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                            formData.enableBulkQuantity ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              formData.enableBulkQuantity ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6 animate-in fade-in text-center py-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Shop Profile Ready!</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your store has been verified. You can now manage your catalog, source produce directly from verified farmers, and serve local consumers.
                </p>
              </div>

              {/* Summary of feature flags */}
              <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <Truck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Logistics Option</span>
                  </div>
                  <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {formData.enableLogistics ? '✓ Enabled on Dashboard' : '✗ Disabled (Simplified)'}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Bulk Quantity</span>
                  </div>
                  <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    {formData.enableBulkQuantity ? '✓ Enabled on Dashboard' : '✗ Disabled (Standard)'}
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-950/60 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs font-mono text-indigo-800 dark:text-indigo-300 max-w-sm mx-auto">
                <ShieldCheck className="w-4 h-4 inline mr-1 text-indigo-600 dark:text-indigo-400" />
                Verified Shop Status: ACTIVE
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                You can toggle Logistics and Bulk Quantity features at any time from your Account Settings.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Previous
              </button>
            ) : <div />}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="px-8 py-4 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Go to Shopkeeper Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
