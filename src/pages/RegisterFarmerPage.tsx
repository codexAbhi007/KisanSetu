import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Database, Server, Cpu, Zap, Truck, Check } from 'lucide-react';
import { generateHyperScaleId } from '../config/hyperScaleEngine';

export const RegisterFarmerPage: React.FC = () => {
  const { setActivePage, registerDirectProfile, showToast } = useApp();
  const [step, setStep] = useState(1);

  // Form states across 6 steps
  const [formData, setFormData] = useState({
    fullName: 'Rajesh Patil',
    email: 'rajesh.patil@kisansetu.in',
    phone: '+91 98765 43210',
    dob: '1984-05-14',
    gender: 'Male',
    farmName: 'Patil Organic Agri Farm',
    address: 'Nashik Corridor, Post Niphad',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Niphad',
    pincode: '422303',
    farmArea: '12.5 Acres',
    ownershipType: 'Owned',
    primaryCrops: 'Tomatoes, Onions, Grapes',
    secondaryCrops: 'Pomegranate, Green Chilies',
    expectedProduction: '1,500 kg / month',
    farmingMethod: 'Organic & Good Agricultural Practices',
    harvestSeason: 'Rabi & Kharif',
    productsAvailable: 'Tomatoes (Grade A), Onions',
    minOrderKg: '50 kg',
    preferredBuyers: 'Shopkeepers & Supermarkets',
    sellingRadius: '50 km',
    enableLogistics: true,
    enableBulkQuantity: true,
    bankName: 'State Bank of India',
    ifsc: 'SBIN0001234',
    accountNumber: '••••••••4821',
    upiId: 'rajesh.patil@oksbi',
  });

  const [registeredShard, setRegisteredShard] = useState<string>('');
  const [registeredUid, setRegisteredUid] = useState<string>('');

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleComplete = async () => {
    const { uid, shardId, partition } = generateHyperScaleId('farmer', formData.state);
    setRegisteredShard(shardId);
    setRegisteredUid(uid);

    await registerDirectProfile({
      uid,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: 'farmer',
      status: 'active',
      enableLogistics: formData.enableLogistics,
      enableBulkQuantity: formData.enableBulkQuantity,
      location: {
        state: formData.state,
        district: formData.district,
        villageOrCity: formData.village,
        pincode: formData.pincode,
      },
      farmOrBusinessDetails: {
        farmName: formData.farmName,
        farmAreaAcres: 12.5,
        primaryCrops: [formData.primaryCrops],
      },
      rating: 5.0,
      verified: true,
      createdAt: new Date().toISOString(),
      shardId,
      partitionCluster: partition,
    });

    showToast(`Farmer onboarding registered in 500-Crore Hyper-Scale Partition (${shardId})!`);
    setActivePage('farmer_dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header & Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActivePage('auth_farmer')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Farmer Login</span>
            </button>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-sm border border-emerald-200 dark:border-emerald-800">
              STEP {step} OF 6
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded">
                PLANETARY CAPACITY: 500 CRORE FARMERS
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">128-bit Collision-Free ID</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Farmer Onboarding & Registration</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Complete your profile to start selling produce directly with AI pricing and secure escrow on the 500-Crore Hyper-Scale Agri Grid.
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Basic Producer Information</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Provide your personal identification details.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Farm & Location Details</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Where is your agricultural land located?</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Farm / Enterprise Name *</label>
                  <input
                    type="text"
                    value={formData.farmName}
                    onChange={(e) => handleChange('farmName', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">District *</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Village / Town *</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => handleChange('village', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">PIN Code *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Farm Land Area</label>
                  <input
                    type="text"
                    value={formData.farmArea}
                    onChange={(e) => handleChange('farmArea', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Agricultural & Crop Information</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">What crops do you cultivate?</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Primary Crops Cultivated *</label>
                  <input
                    type="text"
                    value={formData.primaryCrops}
                    onChange={(e) => handleChange('primaryCrops', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Secondary Crops</label>
                  <input
                    type="text"
                    value={formData.secondaryCrops}
                    onChange={(e) => handleChange('secondaryCrops', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Expected Monthly Production</label>
                    <input
                      type="text"
                      value={formData.expectedProduction}
                      onChange={(e) => handleChange('expectedProduction', e.target.value)}
                      className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Farming Method</label>
                    <input
                      type="text"
                      value={formData.farmingMethod}
                      onChange={(e) => handleChange('farmingMethod', e.target.value)}
                      className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Selling Preferences, Logistics & Bulk Options</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure your harvest distribution and opt-in service capabilities.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Products Available for Listing *</label>
                  <input
                    type="text"
                    value={formData.productsAvailable}
                    onChange={(e) => handleChange('productsAvailable', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Preferred Buyers</label>
                    <input
                      type="text"
                      value={formData.preferredBuyers}
                      onChange={(e) => handleChange('preferredBuyers', e.target.value)}
                      className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Selling Radius</label>
                    <input
                      type="text"
                      value={formData.sellingRadius}
                      onChange={(e) => handleChange('sellingRadius', e.target.value)}
                      className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Optional Service Capabilities Toggles */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Service Capabilities (Opt-in Options)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Choose which modules to enable on your dashboard. You can also change these anytime in Settings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {/* Logistics Toggle Card */}
                    <div
                      onClick={() => handleChange('enableLogistics', !formData.enableLogistics)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        formData.enableLogistics
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
                              formData.enableLogistics
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {formData.enableLogistics ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Logistics & Transport</h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          Coordinate delivery options, track vehicle dispatches, and work with transport partners directly from your dashboard.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <span>Click to {formData.enableLogistics ? 'Disable' : 'Enable'}</span>
                        <div
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                            formData.enableLogistics ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
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
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bulk Quantity & MOQ</h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          List large volume lots (100kg to 10+ tons), set minimum order quantities, and offer tier discounts to kiranas and bulk buyers.
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

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Bank & Secure Payment Details</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">For direct payout settlement upon escrow release.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Bank Name *</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">IFSC Code *</label>
                  <input
                    type="text"
                    value={formData.ifsc}
                    onChange={(e) => handleChange('ifsc', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Account Number *</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">UPI ID</label>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => handleChange('upiId', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6 animate-in fade-in text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Farmer Profile Ready!</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your registration details have been verified against land records. You are ready to manage your harvest database and sell directly on KisanSetu.
                </p>
              </div>

              {/* Summary of feature flags */}
              <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Logistics Option</span>
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
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

              <div className="bg-emerald-50 dark:bg-emerald-950/60 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-mono text-emerald-800 dark:text-emerald-300 max-w-sm mx-auto">
                <ShieldCheck className="w-4 h-4 inline mr-1 text-emerald-600 dark:text-emerald-400" />
                Verified Producer Status: ACTIVE
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
                className="px-6 py-3 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="px-8 py-4 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Go to Farmer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
