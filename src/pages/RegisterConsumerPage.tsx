import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Database } from 'lucide-react';
import { generateHyperScaleId } from '../config/hyperScaleEngine';

export const RegisterConsumerPage: React.FC = () => {
  const { setActivePage, registerDirectProfile, showToast } = useApp();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: 'Ananya Gupta',
    email: 'ananya.gupta@example.com',
    phone: '+91 97000 11223',
    address: 'Flat 402, Greenwoods Apartments, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    favoriteCategories: 'Vegetables, Fruits, Organic Produce',
    deliveryTime: 'Morning Slot (7:00 AM - 9:00 AM)',
  });

  const handleChange = (field: string, val: string) => {
    setFormData({ ...formData, [field]: val });
  };

  const handleComplete = async () => {
    const { uid, shardId, partition } = generateHyperScaleId('consumer', formData.state);

    await registerDirectProfile({
      uid,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: 'consumer',
      status: 'active',
      enableLogistics: false,
      enableBulkQuantity: false,
      location: {
        state: formData.state,
        district: formData.city,
        villageOrCity: formData.city,
        pincode: formData.pincode,
      },
      rating: 5.0,
      verified: true,
      createdAt: new Date().toISOString(),
      shardId,
      partitionCluster: partition,
    });

    showToast(`Consumer account verified on 500+ Crore Hyper-Scale Grid (${shardId})!`);
    setActivePage('marketplace');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header & Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActivePage('auth_consumer')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Consumer Login</span>
            </button>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-sm border border-amber-200 dark:border-amber-800">
              STEP {step} OF 5
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded">
                PLANETARY CAPACITY: &gt;500 CRORE USERS
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">128-bit Collision-Free ID</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Consumer Account</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Get farm-fresh produce delivered directly from local shops and verified farmers on the 500-Crore Agri Grid.
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-600 h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Personal Information</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enter your name and contact info.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Delivery Address</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Where should your orders be delivered?</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Street Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">PIN Code *</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Produce Preferences</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">What type of agricultural produce do you buy most often?</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Favorite Categories</label>
                  <input
                    type="text"
                    value={formData.favoriteCategories}
                    onChange={(e) => handleChange('favoriteCategories', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Delivery Time Window</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select when you prefer receiving your deliveries.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Preferred Time Slot</label>
                  <input
                    type="text"
                    value={formData.deliveryTime}
                    onChange={(e) => handleChange('deliveryTime', e.target.value)}
                    className="w-full p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in text-center py-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Ready!</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your consumer account is ready. Explore the marketplace to discover fresh produce from trusted local shops and farms.
                </p>
              </div>
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

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 rounded-sm bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="px-8 py-4 rounded-sm bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
