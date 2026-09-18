import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AuthStatusBar } from './AuthStatusBar';
import {
  ShoppingBag,
  Bell,
  User,
  LogIn,
  MapPin,
  Boxes,
  Truck,
  Menu,
  X,
  Search,
  Heart,
  ChevronDown,
  Sparkles,
  Zap,
  Sprout,
  Apple,
  Wheat,
  Milk,
  Flame,
  CheckCircle2,
  Percent,
  Sun,
  Moon,
  Settings,
  LogOut,
  Sliders,
  LayoutDashboard,
} from 'lucide-react';

// Renders text with the matched query substring highlighted
const highlightMatch = (text: string, query: string): React.ReactNode => {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-200/70 dark:bg-amber-500/30 text-inherit rounded-xs px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
};

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    currentUser,
    cart,
    setIsCartOpen,
    wishlist,
    notifications,
    markNotificationRead,
    setIsRoleSelectOpen,
    setIsSettingsOpen,
    handleLogout,
    theme,
    toggleTheme,
    loginWithRole,
    products,
    setSelectedProductId,
    setGlobalSearchQuery,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Pune - 411014 (Koregaon Park)');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalCartQty = cart.reduce((acc, item) => acc + item.quantityKg, 0);
  const totalCartAmount = cart.reduce(
    (acc, item) => acc + item.product.pricePerKg * item.quantityKg,
    0
  );

  // Search placeholders rotation
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = [
    'Search for fresh tomatoes, Shimla apples...',
    'Search for Sharbati wheat, Kolam rice...',
    'Search for 30-min delivery Kirana stores...',
    'Search for 100kg+ FPO wholesale lots...',
    'Search for organic vegetables & cold-pressed oils...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close the suggestions dropdown when clicking outside the search area
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Live catalog matches for the suggestions dropdown
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const suggestions =
    normalizedQuery.length === 0
      ? []
      : products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(normalizedQuery) ||
              p.sellerName.toLowerCase().includes(normalizedQuery) ||
              p.location.toLowerCase().includes(normalizedQuery) ||
              p.category.toLowerCase().includes(normalizedQuery)
          )
          .slice(0, 6);

  // Navigate straight to a suggested product
  const goToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
    setSearchQuery('');
    setActivePage('product_detail');
  };

  // Push the query to the global search state and open the filtered catalog
  const submitSearch = () => {
    setGlobalSearchQuery(searchQuery.trim());
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
    setActivePage('marketplace');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enter selects the keyboard-highlighted suggestion if one is active
    if (suggestionsOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      goToProduct(suggestions[highlightedIndex].id);
      return;
    }
    submitSearch();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setSuggestionsOpen(true);
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setSuggestionsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setGlobalSearchQuery('');
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <header className="bg-white dark:bg-slate-900 sticky top-0 z-40 shadow-sm font-sans select-none border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* 1. TOP UTILITY STRIP */}
      <div className="bg-[#064e3b] dark:bg-emerald-950 text-emerald-100 text-[11px] font-medium py-1.5 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors bg-[#065f46] dark:bg-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-400/30"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Deliver to:</span>
              <strong className="text-white font-semibold underline decoration-dotted">
                {selectedCity}
              </strong>
              <ChevronDown className="w-3 h-3 text-amber-300" />
            </div>

            <div className="hidden lg:flex items-center gap-2 text-emerald-100">
              <span className="flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-xs text-[10px]">
                <Zap className="w-3 h-3 fill-current text-slate-950" />
                30 MINS
              </span>
              <span>⚡ KisanSetu Instant Kirana & Farm Fresh Network</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActivePage('fpo_pool')}
              className="hidden md:flex items-center gap-1 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              <Boxes className="w-3.5 h-3.5 text-amber-400" />
              <span>Mandi Bulk B2B (100kg+)</span>
            </button>

            <span className="hidden md:inline text-emerald-600">|</span>

            <button
              onClick={() => setIsRoleSelectOpen(true)}
              className="hidden sm:flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Sell on KisanSetu (Farmer / Kirana)</span>
            </button>

            <span className="hidden sm:inline text-emerald-600">|</span>

            <button
              onClick={() => setActivePage('network_architecture')}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-sm transition-all shadow-xs cursor-pointer"
            >
              <span>🌐 National Grid Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. AUTH STATUS & QUICK 4-ROLE LOGIN BAR */}
      <AuthStatusBar />

      {/* 3. MAIN BRAND HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-6">
          {/* Brand Logo (KisanSetu) */}
          <div
            onClick={() => setActivePage('landing')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            {/* Custom KisanSetu Agrarian Bridge Monogram */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 flex items-center justify-center text-white font-extrabold shadow-md border-2 border-emerald-400/40 group-hover:scale-105 transition-transform">
              <span className="text-lg tracking-tighter font-black font-mono text-amber-300">KS</span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">
                  kisan<span className="text-emerald-700 dark:text-emerald-400">setu</span>
                </span>
                <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-xs tracking-wider">
                  DIRECT
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight -mt-0.5">
                Direct Farm & Kirana Agricultural Network
              </p>
            </div>
          </div>

          {/* Mega "SHOP BY CATEGORY" Dropdown Button */}
          <div className="relative hidden xl:block shrink-0">
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              onMouseEnter={() => setMegaMenuOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2.5 shadow-sm transition-all cursor-pointer uppercase tracking-wider"
            >
              <Menu className="w-4 h-4" />
              <span>Shop by Category</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Mega Dropdown Menu */}
            {megaMenuOpen && (
              <div
                onMouseLeave={() => setMegaMenuOpen(false)}
                className="absolute left-0 top-full mt-1.5 w-[760px] max-w-[90vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 p-5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Column 1: Fresh Produce */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider border-b border-emerald-100 dark:border-slate-800 pb-1.5">
                    <Apple className="w-4 h-4 text-emerald-600" />
                    <span>Fruits & Vegetables</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <li
                      onClick={() => {
                        setActivePage('marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1"
                    >
                      <span>Fresh Farm Vegetables</span>
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                        Daily
                      </span>
                    </li>
                    <li
                      onClick={() => {
                        setActivePage('marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1"
                    >
                      <span>Seasonal & Exotic Fruits</span>
                      <span className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                        Fresh
                      </span>
                    </li>
                    <li
                      onClick={() => {
                        setActivePage('marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1"
                    >
                      <span>Certified Organic Produce</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold px-1.5 py-0.2 rounded">
                        GAP
                      </span>
                    </li>
                    <li
                      onClick={() => {
                        setActivePage('marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1"
                    >
                      <span>Hydroponic & Salad Greens</span>
                    </li>
                    <li
                      onClick={() => {
                        setActivePage('marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1"
                    >
                      <span>Herbs, Garlic & Fresh Ginger</span>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Staples, Dairy & Grains */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider border-b border-emerald-100 dark:border-slate-800 pb-1.5">
                    <Wheat className="w-4 h-4 text-amber-600" />
                    <span>Foodgrains & Dairy</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <li
                      onClick={() => {
                        setActivePage('marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1"
                    >
                      <span>Atta, Flours & Sharbati Wheat</span>
                    </li>
                    <li
                      onClick={() => {
                        setActivePage('marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1"
                    >
                      <span>Basmati & Regional Rice</span>
                    </li>
                    <li
                      onClick={() => {
                        setActivePage('marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1"
                    >
                      <span>Farm Milk, Paneer & Curd</span>
                      <span className="text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                        Dairy
                      </span>
                    </li>
                    <li
                      onClick={() => {
                        setActivePage('marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1"
                    >
                      <span>Cold-Pressed Mustard & Groundnut Oil</span>
                    </li>
                    <li
                      onClick={() => {
                        setActivePage('marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1"
                    >
                      <span>Mandi Dals, Pulses & Spices</span>
                    </li>
                  </ul>
                </div>

                {/* Column 3: B2B Wholesale, Express & AI Compare */}
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Special Platforms</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <li
                      onClick={() => {
                        setActivePage('bulk_marketplace');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                        <Boxes className="w-3.5 h-3.5 text-sky-600" />
                        <span>B2B Mandi Bulk Lots (100kg+)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        Direct FPO volume with tiered discounts & Escrow.
                      </p>
                    </li>

                    <li
                      onClick={() => {
                        setActivePage('consumer_home');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        <span>30-Min Neighborhood Kirana</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        Instant delivery from verified local store partners.
                      </p>
                    </li>

                    <li
                      onClick={() => {
                        setActivePage('network_architecture');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-200 dark:border-emerald-800"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-emerald-950 dark:text-emerald-200">
                        <Percent className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        <span>Kisan AI Price Comparison</span>
                      </div>
                      <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-normal">
                        Compare Farmer vs Kirana shop rates instantly.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Central Mega Search Bar with Live Suggestions */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="w-full flex items-center bg-slate-50 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all overflow-hidden shadow-2xs">
                <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSuggestionsOpen(true);
                    setHighlightedIndex(-1);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) setSuggestionsOpen(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={placeholders[placeholderIndex]}
                  aria-label="Search produce, sellers and locations"
                  autoComplete="off"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none bg-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2 cursor-pointer"
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-5 py-3 font-bold text-xs transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                  title="Search"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Live Suggestions Dropdown */}
            {suggestionsOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                {suggestions.length > 0 ? (
                  <>
                    <div className="px-4 pt-2.5 pb-1.5 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {suggestions.length} catalog match{suggestions.length !== 1 ? 'es' : ''}
                    </div>
                    <ul className="max-h-72 overflow-y-auto">
                      {suggestions.map((p, idx) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            onClick={() => goToProduct(p.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                              highlightedIndex === idx
                                ? 'bg-emerald-50 dark:bg-slate-800'
                                : 'bg-white dark:bg-slate-900'
                            }`}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.visibility = 'hidden';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {highlightMatch(p.name, searchQuery.trim())}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {p.sellerType === 'farmer' ? '🌾' : '🏪'} {p.sellerName} • {p.location} • {p.category}
                              </p>
                            </div>
                            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 shrink-0">
                              ₹{p.pricePerKg}/kg
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={submitSearch}
                      className="w-full px-4 py-2.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>See all results for "{searchQuery.trim()}"</span>
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-5 text-center">
                    <Search className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      No matches for "{searchQuery.trim()}"
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Try a produce name, seller, city or category — e.g. "tomato", "wheat", "Nashik".
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* LIGHT & DARK MODE NAVIGATION BUTTON */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer group"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle Light and Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-90 transition-transform duration-300 fill-amber-400/20" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 group-hover:-rotate-12 transition-transform duration-300 fill-slate-700/20" />
              )}
              <span className="text-[11px] font-extrabold hidden md:inline text-slate-800 dark:text-slate-200">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setActivePage('wishlist')}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
              title="Saved Items / Wishlist"
            >
              <Heart className="w-5 h-5 text-rose-500" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Live Map & Tracking Button */}
            <button
              onClick={() => setActivePage('live_map')}
              className="px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer font-extrabold text-xs"
              title="Google Maps Live Tracking & Geofencing"
            >
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-bounce" />
              <span className="hidden xl:inline">Live Map & Tracking</span>
            </button>

            {/* Notifications Alert Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                title="Notifications & Mandi Alerts"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 px-4 z-50 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      Notifications & Mandi Alerts
                    </span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          notif.read
                            ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                            : 'bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 text-slate-900 dark:text-slate-100 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-emerald-950 dark:text-emerald-300 mb-0.5">
                          <span>{notif.title}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fresh Login / Sign In Button or Account Switcher */}
            {!currentUser ? (
              <button
                id="navbar-primary-login-btn"
                onClick={() => setActivePage('auth')}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md border-2 border-amber-500 hover:shadow-lg hover:scale-105 cursor-pointer group shrink-0 animate-pulse"
                title="Login / Sign In to KisanSetu (Farmer, Shopkeeper, Consumer, Logistics)"
              >
                <LogIn className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                <span>🔑 LOGIN / SIGN IN</span>
              </button>
            ) : (
              <div className="relative flex items-center gap-1.5">
                {/* User Menu Trigger */}
                <button
                  id="navbar-user-profile-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-200 font-bold text-xs transition-all flex items-center gap-2 border border-emerald-400 dark:border-emerald-700 shadow-xs cursor-pointer shrink-0"
                  title="Logged in - Click to manage account or switch roles"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">
                    {currentUser.role === 'farmer' ? '🌾' : currentUser.role === 'shopkeeper' ? '🏪' : currentUser.role === 'consumer' ? '🛒' : '🚚'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-black leading-none">
                        {currentUser.role === 'farmer' ? 'Farmer' : currentUser.role === 'shopkeeper' ? 'Shopkeeper' : currentUser.role === 'consumer' ? 'Consumer' : 'Logistics'}
                      </span>
                    </div>
                    <span className="block text-[11px] leading-tight font-extrabold text-slate-900 dark:text-slate-100 truncate max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                </button>

                {/* Direct Switch Role / Login as Another Role Button */}
                <button
                  id="navbar-switch-role-btn"
                  onClick={() => setIsRoleSelectOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Switch or Test Login for all 4 roles"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden md:inline">Switch Role</span>
                </button>

                {/* Direct Settings Gear Button */}
                <button
                  id="navbar-gear-settings-btn"
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                  title="Account Settings & Service Preferences (Logistics & Bulk)"
                >
                  <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:rotate-45 transition-transform" />
                </button>

                {/* Direct Sign Out Button */}
                <button
                  id="navbar-direct-logout-btn"
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 transition-colors flex items-center justify-center cursor-pointer"
                  title="Sign Out / Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 px-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="pb-3 mb-2 border-b border-slate-100 dark:border-slate-800 px-2">
                      <div className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                        {currentUser.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-black px-2 py-0.5 rounded uppercase">
                          {currentUser.role}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {currentUser.shardId || 'SHARD-001'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {/* Dashboard Link */}
                      <button
                        onClick={() => {
                          if (currentUser.role === 'farmer') setActivePage('farmer_dashboard');
                          else if (currentUser.role === 'shopkeeper') setActivePage('shopkeeper_dashboard');
                          else setActivePage('consumer_home');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          {currentUser.role === 'farmer'
                            ? 'Farmer Portal & Listings'
                            : currentUser.role === 'shopkeeper'
                            ? 'Kirana Store Dashboard'
                            : 'Consumer Fresh Market'}
                        </span>
                      </button>

                      {/* Settings Link */}
                      <button
                        id="user-dropdown-settings-btn"
                        onClick={() => {
                          setIsSettingsOpen(true);
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <Sliders className="w-4 h-4 text-amber-500" />
                        <div>
                          <span className="block font-bold">Account Settings</span>
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                            Logistics & Bulk service preferences
                          </span>
                        </div>
                      </button>

                      {/* Role Switcher */}
                      <button
                        onClick={() => {
                          setIsRoleSelectOpen(true);
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <User className="w-4 h-4 text-indigo-500" />
                        <span>Switch Role (Farmer / Kirana / Consumer)</span>
                      </button>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            handleLogout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center gap-2.5 cursor-pointer transition-colors font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* KISANSETU CART / BASKET BUTTON */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
                {totalCartQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-950 text-amber-300 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalCartQty}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] font-medium block text-amber-100 leading-none">
                  My Basket
                </span>
                <span className="text-xs font-black tracking-tight leading-tight">
                  ₹{totalCartAmount > 0 ? totalCartAmount : '0.00'}
                </span>
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. SECONDARY CATEGORY NAVIGATION RIBBON */}
      <div className="bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 hidden md:block text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-4">
          <div className="flex items-center gap-5 shrink-0">
            <button
              onClick={() => setActivePage('marketplace')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activePage === 'marketplace' ? 'text-emerald-800 dark:text-emerald-400 font-bold border-b-2 border-emerald-700 dark:border-emerald-500' : ''
              }`}
            >
              <Apple className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fruits & Vegetables</span>
            </button>

            <button
              onClick={() => setActivePage('marketplace')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Wheat className="w-3.5 h-3.5 text-amber-600" />
              <span>Foodgrains, Oil & Masala</span>
            </button>

            <button
              onClick={() => setActivePage('marketplace')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Milk className="w-3.5 h-3.5 text-blue-500" />
              <span>Bakery & Farm Dairy</span>
            </button>

            <button
              onClick={() => setActivePage('bulk_marketplace')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activePage === 'bulk_marketplace' ? 'text-emerald-800 dark:text-emerald-400 font-bold' : ''
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-sky-600" />
              <span>B2B Mandi Lots (100kg+)</span>
            </button>

            <button
              onClick={() => setActivePage('consumer_home')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activePage === 'consumer_home' ? 'text-emerald-800 dark:text-emerald-400 font-bold' : ''
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>⚡ 30-Min Kirana Express</span>
            </button>

            <button
              onClick={() => setActivePage('fpo_pool')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activePage === 'fpo_pool' ? 'text-emerald-800 dark:text-emerald-400 font-bold' : ''
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>FPO Aggregation Pools</span>
            </button>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-bold">
            <button
              onClick={() => setActivePage('track_order')}
              className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-sky-600" />
              <span>Live GPS Order Tracking</span>
            </button>

            <button
              onClick={() => setActivePage('network_architecture')}
              className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>National Agri-Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 font-semibold text-xs animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Theme Toggle Button */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-600" />
              )}
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Switch to Dark</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Login / User Profile Action */}
          {!currentUser ? (
            <div className="space-y-2 mb-3">
              <button
                onClick={() => {
                  setActivePage('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md border-2 border-amber-500 cursor-pointer animate-pulse"
              >
                <LogIn className="w-4 h-4 text-slate-950" />
                <span>🔑 LOGIN / SIGN IN (ALL 4 ROLES)</span>
              </button>

              {/* 4 Quick Mobile Logins */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => {
                    loginWithRole('farmer');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg bg-emerald-950 text-emerald-200 border border-emerald-700 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🌾 Farmer Login</span>
                </button>
                <button
                  onClick={() => {
                    loginWithRole('shopkeeper');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg bg-indigo-950 text-indigo-200 border border-indigo-700 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🏪 Kirana Login</span>
                </button>
                <button
                  onClick={() => {
                    loginWithRole('consumer');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg bg-amber-950 text-amber-200 border border-amber-700 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🛒 Consumer Login</span>
                </button>
                <button
                  onClick={() => {
                    loginWithRole('logistics_partner');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg bg-sky-950 text-sky-200 border border-sky-700 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🚚 Logistics Login</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-black">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">{currentUser.name}</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                      <span>{currentUser.role.replace('_', ' ')} • LOGGED IN</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-[11px] font-bold cursor-pointer"
                >
                  Log Out
                </button>
              </div>

              {/* Quick switch options */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-emerald-200/50 dark:border-emerald-800/50">
                <button
                  onClick={() => {
                    loginWithRole('farmer');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                    currentUser.role === 'farmer' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>🌾 Farmer</span>
                </button>
                <button
                  onClick={() => {
                    loginWithRole('shopkeeper');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                    currentUser.role === 'shopkeeper' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>🏪 Shopkeeper</span>
                </button>
                <button
                  onClick={() => {
                    loginWithRole('consumer');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                    currentUser.role === 'consumer' ? 'bg-amber-500 text-slate-950 border-amber-300 font-extrabold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>🛒 Consumer</span>
                </button>
                <button
                  onClick={() => {
                    loginWithRole('logistics_partner');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                    currentUser.role === 'logistics_partner' ? 'bg-sky-600 text-white border-sky-400' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>🚚 Logistics</span>
                </button>
              </div>
            </div>
          )}

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-100 dark:border-emerald-800 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span className="font-bold text-emerald-950 dark:text-emerald-200">{selectedCity}</span>
            </div>
            <button
              onClick={() => setLocationModalOpen(true)}
              className="text-emerald-800 dark:text-emerald-300 text-[11px] font-bold underline cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Mobile Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-full mb-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 fill-slate-700/20" />
              )}
              <span>Theme Mode: {theme === 'dark' ? 'Dark' : 'Light'}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 uppercase">
              Switch to {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>

          <button
            onClick={() => {
              setActivePage('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <span>🏠 Home & Direct Farm Deals</span>
          </button>

          <button
            onClick={() => {
              setActivePage('marketplace');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <span>🥦 Fruits & Vegetables Marketplace</span>
          </button>

          <button
            onClick={() => {
              setActivePage('consumer_home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <span>⚡ 30-Min Neighborhood Kirana Store</span>
          </button>

          <button
            onClick={() => {
              setActivePage('bulk_marketplace');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <span>📦 B2B Bulk Mandi Lots (100kg+)</span>
          </button>

          <button
            onClick={() => {
              setActivePage('fpo_pool');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <span>🌾 FPO Collective Pools</span>
          </button>

          <button
            onClick={() => {
              setActivePage('track_order');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <span>🚚 Live GPS Tracking</span>
          </button>

          <button
            onClick={() => {
              setIsSettingsOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 font-bold flex items-center gap-2 cursor-pointer border border-amber-300 dark:border-amber-800"
          >
            <span>⚙️ Account Settings & Toggles</span>
          </button>

          <button
            onClick={() => {
              setActivePage('network_architecture');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 font-bold flex items-center gap-2 cursor-pointer"
          >
            <span>🌐 National Agri-Grid Architecture</span>
          </button>
        </div>
      )}

      {/* Location Picker Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Choose Delivery Location</h3>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Select your city to check 30-minute Kirana express delivery slots & local farm-fresh mandi inventory.
            </p>

            <div className="space-y-2">
              {[
                'Pune - 411014 (Koregaon Park & Viman Nagar)',
                'Mumbai - 400050 (Bandra & Andheri)',
                'Nashik - 422001 (Mandi Source Hub)',
                'Bengaluru - 560001 (Indiranagar & Whitefield)',
                'Delhi NCR - 110001 (Connaught Place & Gurgaon)',
                'Kolkata - 700091 (Salt Lake City Sector V)',
              ].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedCity(loc);
                    setLocationModalOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCity === loc
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-600 ring-1 ring-emerald-400'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{loc}</span>
                  {selectedCity === loc && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
