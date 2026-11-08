import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { SubdomainBar } from './components/common/SubdomainBar';
import { CreateStoreModal } from './components/common/CreateStoreModal';
import { StorefrontHeader } from './components/storefront/StorefrontHeader';
import { HeroBanner } from './components/storefront/HeroBanner';
import { ProductGrid } from './components/storefront/ProductGrid';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { StorefrontFooter } from './components/storefront/StorefrontFooter';
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminPayments } from './components/admin/AdminPayments';
import { AdminThemes } from './components/admin/AdminThemes';
import { AdminSettings } from './components/admin/AdminSettings';

const MainLayout: React.FC = () => {
  const { currentView, adminTab, currentStore } = useStore();
  const [isCreateStoreModalOpen, setIsCreateStoreModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-amber-100 selection:text-amber-950 font-sans-clean">
      {/* Global Subdomain & Mode Switcher Bar */}
      <SubdomainBar onOpenCreateModal={() => setIsCreateStoreModalOpen(true)} />

      {/* Main Content Area based on View Mode */}
      {currentView === 'storefront' ? (
        <div className="flex-1 flex flex-col">
          <StorefrontHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <main className="flex-1">
            <HeroBanner onExploreClick={scrollToCollection} />

            <ProductGrid
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </main>

          <StorefrontFooter />
        </div>
      ) : (
        /* Owner Admin Dashboard */
        <div className="flex-1 flex flex-col bg-neutral-100/60 pb-16">
          <AdminHeader />

          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {adminTab === 'overview' && <AdminOverview />}
            {adminTab === 'products' && <AdminProducts />}
            {adminTab === 'orders' && <AdminOrders />}
            {adminTab === 'payments' && <AdminPayments />}
            {adminTab === 'themes' && <AdminThemes />}
            {adminTab === 'settings' && <AdminSettings />}
          </main>
        </div>
      )}

      {/* Shared Interactive Overlays & Modals */}
      <ProductDetailModal />

      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <CreateStoreModal
        isOpen={isCreateStoreModalOpen}
        onClose={() => setIsCreateStoreModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
