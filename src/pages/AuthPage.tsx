import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, UserProfile } from '../types';
import {
  Sprout,
  Store,
  ShoppingBag,
  Boxes,
  Truck,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Zap,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockData';

export const AuthPage: React.FC = () => {
  const { setActivePage, setCurrentUser, loginWithRole, loginWithEmail, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('ramesh.kumar@kisansetu.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [enableLogistics, setEnableLogistics] = useState(true);
  const [enableBulkQuantity, setEnableBulkQuantity] = useState(true);

  useEffect(() => {
    document.title = "Unified Login | KisanSetu Agricultural Cloud";
  }, []);

  // Update default credentials based on selected role
  useEffect(() => {
    switch (selectedRole) {
      case 'farmer':
        setEmail('ramesh.kumar@kisansetu.in');
        setPhone('+91 98765 43210');
        break;
      case 'shopkeeper':
        setEmail('sharma.store@kisansetu.in');
        setPhone('+91 98111 22334');
        break;
      case 'consumer':
        setEmail('ananya.gupta@example.com');
        setPhone('+91 97000 11223');
        break;
      case 'logistics_partner':
        setEmail('amit.fleet@kisansetu.in');
        setPhone('+91 99887 76655');
        break;
      default:
        break;
    }
  }, [selectedRole]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    setOtpTimer(45);
    setOtpCode(['4', '8', '2', '9', '1', '0']);
    showToast(`Verification code sent to ${phone}. Test OTP filled: 482910`);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Find matching mock user or use current role template
      const matched = MOCK_USERS.find(
        (u) => u.role === selectedRole || u.email.toLowerCase() === email.toLowerCase()
      );

      if (matched) {
        setCurrentUser({
          ...matched,
          enableLogistics: selectedRole === 'consumer' ? false : enableLogistics,
          enableBulkQuantity: selectedRole === 'consumer' ? false : enableBulkQuantity,
        });
      } else {
        const newUser: UserProfile = {
          uid: `user-${Date.now()}`,
          name: email.split('@')[0].toUpperCase(),
          email,
          phone,
          role: selectedRole,
          status: 'active',
          enableLogistics: selectedRole === 'consumer' ? false : enableLogistics,
          enableBulkQuantity: selectedRole === 'consumer' ? false : enableBulkQuantity,
          location: {
            state: 'Maharashtra',
            district: 'Nashik',
            villageOrCity: 'Lasalgaon',
            pincode: '422306',
          },
          rating: 4.9,
          verified: true,
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(newUser);
      }

      showToast(`Welcome back! Authenticated as ${selectedRole.replace('_', ' ').toUpperCase()}`);

      // Redirect to correct dashboard
      if (selectedRole === 'farmer' || selectedRole === 'fpo') {
        setActivePage('farmer_dashboard');
      } else if (selectedRole === 'shopkeeper') {
        setActivePage('shopkeeper_dashboard');
      } else if (selectedRole === 'consumer') {
        setActivePage('consumer_home');
      } else if (selectedRole === 'bulk_buyer') {
        setActivePage('buyer_dashboard');
      } else if (selectedRole === 'logistics_partner') {
        setActivePage('logistics_dashboard');
      } else {
        setActivePage('admin_dashboard');
      }
    } catch (err: any) {
      showToast('Login error. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      showToast('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    // Find mock user for role
    const matched = MOCK_USERS.find((u) => u.role === selectedRole);
    if (matched) {
      setCurrentUser({
        ...matched,
        phone,
        enableLogistics: selectedRole === 'consumer' ? false : enableLogistics,
        enableBulkQuantity: selectedRole === 'consumer' ? false : enableBulkQuantity,
      });
    }

    showToast(`Phone number ${phone} verified successfully!`);

    if (selectedRole === 'farmer') setActivePage('farmer_dashboard');
    else if (selectedRole === 'shopkeeper') setActivePage('shopkeeper_dashboard');
    else if (selectedRole === 'consumer') setActivePage('consumer_home');
    else if (selectedRole === 'logistics_partner') setActivePage('logistics_dashboard');
    else setActivePage('admin_dashboard');

    setIsLoading(false);
  };

  const handleQuickPersonaSelect = (role: UserRole) => {
    loginWithRole(role);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans flex flex-col justify-center transition-colors">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Top Back Nav & Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setActivePage('landing')}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs w-fit cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to KisanSetu Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Planetary Scale: &gt;500 Cr Users • 500 Cr Shops • 500 Cr Farmers</span>
          </div>
        </div>

        {/* Main Dual Card Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-colors">
          {/* Left Column: Visual Showcase & Brand Highlights (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              {/* Brand Monogram */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white font-extrabold shadow-lg border border-emerald-400/40">
                  <span className="text-xl tracking-tighter font-black font-mono text-amber-300">KS</span>
                </div>
                <div>
                  <h1 className="font-extrabold text-2xl tracking-tight text-white">
                    kisan<span className="text-emerald-400">setu</span>
                  </h1>
                  <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest block">
                    National Agricultural Terminal
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
                  Direct Farm-to-Fork Cloud Ecosystem
                </h2>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Connecting over 1,500+ smallholder farmers with neighborhood kirana stores, supermarket bulk buyers, and local households across India.
                </p>
              </div>

              {/* 4 Core Pillars */}
              <div className="space-y-3 pt-4 font-mono text-xs">
                <div className="flex items-start gap-3 bg-emerald-900/50 p-3 rounded-2xl border border-emerald-700/40">
                  <Sprout className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Farmer Freedom</span>
                    <p className="text-[11px] text-emerald-200">Zero middleman cuts. Set your own prices with AI mandi price guidance.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-emerald-900/50 p-3 rounded-2xl border border-emerald-700/40">
                  <Store className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Kirana 30-Min Hubs</span>
                    <p className="text-[11px] text-emerald-200">Procure farm harvests at wholesale rates and deliver to local doorsteps.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-emerald-900/50 p-3 rounded-2xl border border-emerald-700/40">
                  <KeyRound className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Smart Escrow Protection</span>
                    <p className="text-[11px] text-emerald-200">Funds locked securely until buyer confirms quality grade & digital weighment.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Persona Fast Access (Instant 1-Click Login) */}
            <div className="pt-8 border-t border-emerald-800/60 space-y-3 relative z-10">
              <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant 1-Click Demo Portals (All 4 Roles):</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  id="auth-demo-farmer-btn"
                  onClick={() => handleQuickPersonaSelect('farmer')}
                  className="p-2.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-left border border-emerald-700 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-white block text-xs">🌾 Farmer</span>
                  <span className="text-[10px] text-emerald-300">Patil Organic Farm</span>
                </button>
                <button
                  type="button"
                  id="auth-demo-shopkeeper-btn"
                  onClick={() => handleQuickPersonaSelect('shopkeeper')}
                  className="p-2.5 rounded-xl bg-indigo-950/90 hover:bg-indigo-900 text-left border border-indigo-700 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-white block text-xs">🏪 Shopkeeper</span>
                  <span className="text-[10px] text-indigo-300">Sharma Fresh Mart</span>
                </button>
                <button
                  type="button"
                  id="auth-demo-consumer-btn"
                  onClick={() => handleQuickPersonaSelect('consumer')}
                  className="p-2.5 rounded-xl bg-amber-950/90 hover:bg-amber-900 text-left border border-amber-700 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-white block text-xs">🛒 Consumer</span>
                  <span className="text-[10px] text-amber-300">Ananya Sharma</span>
                </button>
                <button
                  type="button"
                  id="auth-demo-logistics-btn"
                  onClick={() => handleQuickPersonaSelect('logistics_partner')}
                  className="p-2.5 rounded-xl bg-sky-950/90 hover:bg-sky-900 text-left border border-sky-700 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-white block text-xs">🚚 Logistics</span>
                  <span className="text-[10px] text-sky-300">Amit Das Fleet</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Fresh Interactive Login Form (7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-between">
            {/* Header & Role Switcher Tabs */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                  KISANSETU UNIFIED GATEWAY
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Sign In to Your Section
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your role from the 4 primary portals: Farmer, Shopkeeper, Consumer, or Logistics Partner.
                </p>
              </div>

              {/* 4 Distinct Role Select Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {[
                  { key: 'farmer', label: 'Farmer / FPO', icon: '🌾' },
                  { key: 'shopkeeper', label: 'Shopkeeper / Kirana', icon: '🏪' },
                  { key: 'consumer', label: 'Consumer', icon: '🛒' },
                  { key: 'logistics_partner', label: 'Logistics Partner', icon: '🚚' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedRole(item.key as UserRole)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer border ${
                      selectedRole === item.key
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 shadow-md font-bold ring-2 ring-emerald-400/50'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[11px] font-bold uppercase font-mono tracking-tight leading-tight">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Optional Service Capabilities Toggles for Farmer and Shopkeeper */}
              {selectedRole !== 'consumer' ? (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Optional Features (Adjust anytime in Settings)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                      enableLogistics
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <input
                        type="checkbox"
                        checked={enableLogistics}
                        onChange={(e) => setEnableLogistics(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                      />
                      <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="leading-tight">
                        <span className="block text-[11px]">Logistics Support</span>
                        <span className="text-[10px] font-normal opacity-80">Fleet, dispatch & tracking</span>
                      </div>
                    </label>

                    <label className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                      enableBulkQuantity
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <input
                        type="checkbox"
                        checked={enableBulkQuantity}
                        onChange={(e) => setEnableBulkQuantity(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                      />
                      <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="leading-tight">
                        <span className="block text-[11px]">Bulk Quantity</span>
                        <span className="text-[10px] font-normal opacity-80">Wholesale lots & MOQs</span>
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>
                    <strong>Consumer Portal:</strong> Simplified zero-clutter experience designed for fast household produce and grocery shopping.
                  </span>
                </div>
              )}
            </div>

            {/* Authentication Method Switcher (Email/Password vs OTP) */}
            <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-mono text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('password')}
                className={`flex-1 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'password'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email & Password</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('otp')}
                className={`flex-1 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'otp'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Mobile OTP</span>
              </button>
            </div>

            {/* Form Mode A: Email & Password */}
            {authMode === 'password' ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {selectedRole === 'farmer'
                      ? 'Farmer Email or Username'
                      : selectedRole === 'shopkeeper'
                      ? 'Store Business Email'
                      : selectedRole === 'consumer'
                      ? 'Personal Email Address'
                      : 'Corporate Work Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. name@kisansetu.in"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Security Password
                    </label>
                    <button
                      type="button"
                      onClick={() => showToast('Password reset link sent to registered email.')}
                      className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>Remember terminal authentication</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {isLoading ? 'Authenticating...' : `Sign In as ${selectedRole.replace('_', ' ').toUpperCase()}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Form Mode B: Mobile Number & OTP */
              <form onSubmit={handleOtpLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Registered Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpTimer > 0}
                      className="px-4 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase rounded-2xl transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Enter 6-Digit Verification Code
                      </label>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                        OTP Auto-sent (482910)
                      </span>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="w-full text-center py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 font-mono font-extrabold text-base focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !otpSent}
                  className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? 'Verifying OTP...' : 'Verify OTP & Enter Workspace'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Registration & Switching Footer */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Don't have an account yet?</span>
                {selectedRole === 'farmer' && (
                  <button
                    onClick={() => setActivePage('register_farmer')}
                    className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Register as a Farmer / FPO →
                  </button>
                )}
                {selectedRole === 'shopkeeper' && (
                  <button
                    onClick={() => setActivePage('register_shopkeeper')}
                    className="font-bold text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Register your Kirana Store →
                  </button>
                )}
                {selectedRole === 'consumer' && (
                  <button
                    onClick={() => setActivePage('register_consumer')}
                    className="font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Create a Consumer Account →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
