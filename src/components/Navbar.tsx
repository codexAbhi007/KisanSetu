import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ShoppingBag,
  User,
  LogIn,
  MapPin,
  Menu,
  X,
  Search,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  Sliders,
  LayoutDashboard,
  Globe,
  CheckCircle2,
} from "lucide-react";

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
    setIsRoleSelectOpen,
    setIsSettingsOpen,
    handleLogout,
    theme,
    toggleTheme,
    products,
    setSelectedProductId,
    setGlobalSearchQuery,
  } = useApp();

  const { t, language, setLanguage, availableLanguages } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Pune (411014)");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  const totalCartQty = cart.reduce((acc, item) => acc + item.quantityKg, 0);
  const totalCartAmount = cart.reduce(
    (acc, item) => acc + item.product.pricePerKg * item.quantityKg,
    0,
  );

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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
              p.category.toLowerCase().includes(normalizedQuery),
          )
          .slice(0, 5);

  const goToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
    setSearchQuery("");
    setActivePage("product_detail");
  };

  const submitSearch = () => {
    setGlobalSearchQuery(searchQuery.trim());
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
    setActivePage("marketplace");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      suggestionsOpen &&
      highlightedIndex >= 0 &&
      suggestions[highlightedIndex]
    ) {
      goToProduct(suggestions[highlightedIndex].id);
      return;
    }
    submitSearch();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setSuggestionsOpen(true);
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setGlobalSearchQuery("");
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <header className="bg-white dark:bg-slate-900 sticky top-0 z-40 shadow-xs font-sans select-none border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* MAIN CLEAN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Left: Brand Logo & Compact Location */}
          <div className="flex items-center gap-4 shrink-0">
            <div
              onClick={() => setActivePage("landing")}
              className="flex items-center gap-2 cursor-pointer group shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black shadow-xs">
                <span className="text-sm font-mono text-amber-300">KS</span>
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                kisan
                <span className="text-emerald-600 dark:text-emerald-400">
                  setu
                </span>
              </span>
            </div>

            {/* Location Pill */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer transition-colors"
              title="Change Delivery City"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                {selectedCity}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Center: Clean Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="w-full flex items-center bg-slate-100 dark:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all overflow-hidden">
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
                  placeholder={t("search_placeholder")}
                  aria-label="Search produce"
                  autoComplete="off"
                  className="w-full px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none bg-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 font-bold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {suggestionsOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                {suggestions.length > 0 ? (
                  <ul className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {suggestions.map((p, idx) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          onClick={() => goToProduct(p.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors cursor-pointer ${
                            highlightedIndex === idx
                              ? "bg-emerald-50 dark:bg-slate-800"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {highlightMatch(p.name, searchQuery.trim())}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {p.sellerName} • {p.location}
                            </p>
                          </div>
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
                            ₹{p.pricePerKg}/kg
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-center text-xs text-slate-500">
                    No products found for "{searchQuery.trim()}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Language, Theme, User, Cart */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Language"
                className="bg-transparent text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none cursor-pointer"
              >
                {availableLanguages.map((l) => (
                  <option
                    key={l.code}
                    value={l.code}
                    className="bg-slate-900 text-white"
                  >
                    {l.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-amber-300 transition-colors cursor-pointer"
              title={`Switch Theme`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* User / Sign In */}
            {!currentUser ? (
              <button
                onClick={() => setActivePage("auth")}
                className="px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>{t("sign_in")}</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[80px]">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold uppercase">
                        {t(
                          currentUser.role,
                          currentUser.role.replace("_", " "),
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (currentUser.role === "farmer")
                          setActivePage("farmer_dashboard");
                        else if (currentUser.role === "shopkeeper")
                          setActivePage("shopkeeper_dashboard");
                        else if (currentUser.role === "logistics_partner")
                          setActivePage("logistics_dashboard");
                        else if (currentUser.role === "admin")
                          setActivePage("admin_dashboard");
                        else setActivePage("consumer_home");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("my_dashboard")}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsRoleSelectOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t("switch_role")}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsSettingsOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t("account_settings")}</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-bold cursor-pointer border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t("sign_out")}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart Pill */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="text-xs font-bold">
                ₹{totalCartAmount > 0 ? totalCartAmount : "0"}
              </span>
              {totalCartQty > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartQty}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CLEAN CATEGORY STRIP */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 hidden md:block text-xs font-semibold text-slate-600 dark:text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-2 gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActivePage("marketplace")}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
                activePage === "marketplace"
                  ? "text-emerald-700 dark:text-emerald-400 font-bold"
                  : ""
              }`}
            >
              {t("fruits_vegetables")}
            </button>

            <button
              onClick={() => setActivePage("marketplace")}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {t("foodgrains_masala")}
            </button>

            <button
              onClick={() => setActivePage("marketplace")}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {t("dairy_bakery")}
            </button>

            <button
              onClick={() => setActivePage("bulk_marketplace")}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
                activePage === "bulk_marketplace"
                  ? "text-emerald-700 dark:text-emerald-400 font-bold"
                  : ""
              }`}
            >
              {t("b2b_bulk")}
            </button>

            <button
              onClick={() => setActivePage("consumer_home")}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
                activePage === "consumer_home"
                  ? "text-emerald-700 dark:text-emerald-400 font-bold"
                  : ""
              }`}
            >
              ⚡ {t("30min_kirana")}
            </button>
          </div>

          <div>
            <button
              onClick={() => setActivePage("track_order")}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              {t("track_orders")}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 space-y-2 text-xs font-semibold">
          <button
            onClick={() => {
              setActivePage("marketplace");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t("fruits_vegetables")}
          </button>
          <button
            onClick={() => {
              setActivePage("consumer_home");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            ⚡ {t("30min_kirana")}
          </button>
          <button
            onClick={() => {
              setActivePage("bulk_marketplace");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t("b2b_bulk")}
          </button>
          <button
            onClick={() => {
              setActivePage("track_order");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t("track_orders")}
          </button>
        </div>
      )}

      {/* Location Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Select City
              </h3>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {[
                "Pune (411014)",
                "Mumbai (400050)",
                "Nashik (422001)",
                "Bengaluru (560001)",
                "Delhi NCR (110001)",
                "Kolkata (700091)",
              ].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedCity(loc);
                    setLocationModalOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCity === loc
                      ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>{loc}</span>
                  {selectedCity === loc && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
