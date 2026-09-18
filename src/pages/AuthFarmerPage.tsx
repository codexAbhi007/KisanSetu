import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, ShieldCheck, ArrowRight, Lock, Mail, Phone, ArrowLeft, Truck, Zap } from 'lucide-react';

export const AuthFarmerPage: React.FC = () => {
  const { setActivePage, setCurrentUser, showToast } = useApp();

  useEffect(() => {
    document.title = "Farmer Login | KisanSetu";
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", "Login to your KisanSetu Farmer Portal to manage produce listings, AI pricing, and direct orders.");
    }
  }, []);

  const [email, setEmail] = useState('farmer@kisansetu.in');
  const [password, setPassword] = useState('password123');
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('482910');
  const [enableLogistics, setEnableLogistics] = useState(true);
  const [enableBulkQuantity, setEnableBulkQuantity] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const farmerName = email.toLowerCase().includes('farmer') ? 'Kisan Producer' : email.split('@')[0];
    setCurrentUser({
      uid: 'farmer-001',
      name: farmerName,
      email: email,
      phone: phone,
      role: 'farmer',
      status: 'active',
      enableLogistics,
      enableBulkQuantity,
      location: {
        state: 'Maharashtra',
        district: 'Nashik',
        villageOrCity: 'Niphad',
        pincode: '422303',
      },
      farmOrBusinessDetails: {
        farmName: 'Patil Organic Agri Farm',
        farmAreaAcres: 12.5,
        primaryCrops: ['Tomatoes', 'Onions', 'Grapes', 'Pomegranate'],
      },
      rating: 4.9,
      verified: true,
      createdAt: new Date().toISOString(),
    });
    showToast(`Welcome! Farmer portal loaded successfully.`);
    setActivePage('farmer_dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-4xl mx-auto w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-colors">
        {/* Left Side: Visual & Branding */}
        <div className="bg-emerald-900 text-emerald-50 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Sprout className="w-64 h-64 text-emerald-300" />
          </div>
          <div className="space-y-6 relative z-10">
            <button
              onClick={() => setActivePage('landing')}
              className="inline-flex items-center gap-2 text-xs font-mono text-emerald-300 hover:text-white transition-colors bg-emerald-950/60 px-3 py-1.5 rounded-sm border border-emerald-800 w-fit cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-2.5 pt-4">
              <div className="w-10 h-10 rounded-sm bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                🌾
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                KisanSetu <span className="text-emerald-400 font-mono text-xs uppercase block">Farmer Portal</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Sell Direct. Earn More. Eliminate Middlemen.
            </h1>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Access AI demand forecasts, fair price recommendations, FPO aggregation pools, and direct shopkeeper orders.
            </p>
          </div>

          <div className="space-y-4 pt-8 relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono bg-emerald-950/80 p-3 rounded-sm border border-emerald-800 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Producer Authentication & Secure Escrow Release</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400/80 pt-2 border-t border-emerald-800/80">
              <span>ROLE: FARMER</span>
              <span>SIH 2026 DEMO</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">SECURE LOGIN</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back, Farmer</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Sign in to manage your farm listings and check market prices.</p>
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-sm font-mono text-xs">
            <button
              type="button"
              onClick={() => setIsPhoneLogin(false)}
              className={`flex-1 py-2 rounded-xs font-bold transition-all cursor-pointer ${
                !isPhoneLogin ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Email / Password
            </button>
            <button
              type="button"
              onClick={() => setIsPhoneLogin(true)}
              className={`flex-1 py-2 rounded-xs font-bold transition-all cursor-pointer ${
                isPhoneLogin ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Phone OTP
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {!isPhoneLogin ? (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-1 animate-in fade-in">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full text-center tracking-widest p-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                )}

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(true);
                      showToast('OTP sent successfully to your mobile number!');
                    }}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
                  >
                    Send Verification OTP
                  </button>
                ) : null}
              </>
            )}

            {/* Optional Logistics and Bulk Quantity Toggles */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Optional Features (Adjustable in Settings):</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={enableLogistics}
                    onChange={(e) => setEnableLogistics(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                  />
                  <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[11px]">Logistics</span>
                </label>
                <label className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={enableBulkQuantity}
                    onChange={(e) => setEnableBulkQuantity(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
                  />
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px]">Bulk Quantity</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In as Farmer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <button
              onClick={() => setActivePage('register_farmer')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Don't have a farmer account? Register now →
            </button>
            <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 pt-2">
              <span>Switch Role:</span>
              <button onClick={() => setActivePage('auth_shopkeeper')} className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                Shopkeeper
              </button>
              <span>•</span>
              <button onClick={() => setActivePage('auth_consumer')} className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">
                Consumer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
