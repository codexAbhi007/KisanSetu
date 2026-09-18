/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ProductionNetworkBar } from './components/ProductionNetworkBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { KisanAIAssistant } from './components/KisanAIAssistant';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { LandingPage } from './pages/LandingPage';
import { ConsumerHomePage } from './pages/ConsumerHomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { BulkMarketplacePage } from './pages/BulkMarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SellerStorefrontPage } from './pages/SellerStorefrontPage';
import { FarmerPantryPage } from './pages/FarmerPantryPage';
import { ShopkeeperPantryPage } from './pages/ShopkeeperPantryPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { ShopkeeperDashboard } from './pages/ShopkeeperDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { LogisticsDashboard } from './pages/LogisticsDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { FPOCollaborationPage } from './pages/FPOCollaborationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { NetworkArchitecturePage } from './pages/NetworkArchitecturePage';
import { GoogleMapsSimulationPage } from './pages/GoogleMapsSimulationPage';
import { RoleSelectModal } from './components/RoleSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthPage } from './pages/AuthPage';
import { AuthFarmerPage } from './pages/AuthFarmerPage';
import { AuthShopkeeperPage } from './pages/AuthShopkeeperPage';
import { AuthConsumerPage } from './pages/AuthConsumerPage';
import { RegisterFarmerPage } from './pages/RegisterFarmerPage';
import { RegisterShopkeeperPage } from './pages/RegisterShopkeeperPage';
import { RegisterConsumerPage } from './pages/RegisterConsumerPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';

function MainContent() {
  const { activePage, toastMessage, isRoleSelectOpen, setIsRoleSelectOpen, isSettingsOpen, setIsSettingsOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative transition-colors duration-200">
      <ProductionNetworkBar />
      <Navbar />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1e3617] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-600 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top duration-300">
          <span className="w-2 h-2 rounded-full bg-[#84c225] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1">
        {activePage === 'landing' && <LandingPage />}
        {activePage === 'consumer_home' && <ConsumerHomePage />}
        {activePage === 'marketplace' && <MarketplacePage />}
        {activePage === 'bulk_marketplace' && <BulkMarketplacePage />}
        {activePage === 'product_detail' && <ProductDetailPage />}
        {activePage === 'seller_storefront' && <SellerStorefrontPage />}
        {activePage === 'farmer_pantry' && <FarmerPantryPage />}
        {activePage === 'shopkeeper_pantry' && <ShopkeeperPantryPage />}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'wishlist' && <WishlistPage />}
        {activePage === 'farmer_dashboard' && <FarmerDashboard />}
        {activePage === 'shopkeeper_dashboard' && <ShopkeeperDashboard />}
        {activePage === 'buyer_dashboard' && <BuyerDashboard />}
        {activePage === 'logistics_dashboard' && <LogisticsDashboard />}
        {activePage === 'admin_dashboard' && <AdminDashboard />}
        {activePage === 'fpo_pool' && <FPOCollaborationPage />}
        {activePage === 'track_order' && <TrackOrderPage />}
        {activePage === 'network_architecture' && <NetworkArchitecturePage />}
        {activePage === 'live_map' && <GoogleMapsSimulationPage />}
        {(activePage === 'auth' || activePage === 'login') && <AuthPage />}
        {activePage === 'auth_farmer' && <AuthFarmerPage />}
        {activePage === 'auth_shopkeeper' && <AuthShopkeeperPage />}
        {activePage === 'auth_consumer' && <AuthConsumerPage />}
        {activePage === 'register_farmer' && <RegisterFarmerPage />}
        {activePage === 'register_shopkeeper' && <RegisterShopkeeperPage />}
        {activePage === 'register_consumer' && <RegisterConsumerPage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'services' && <ServicesPage />}
        {activePage === 'contact' && <ContactPage />}
      </main>

      <RoleSelectModal isOpen={isRoleSelectOpen} onClose={() => setIsRoleSelectOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <CartCheckoutModal />
      <KisanAIAssistant />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
