import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, calculateStoreMetrics } from '../../utils/storeLogic';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Palette,
  Settings,
  Globe,
  ExternalLink,
} from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { currentStore, adminTab, setAdminTab, setCurrentView } = useStore();
  const metrics = calculateStoreMetrics(currentStore.orders);

  const tabs: { id: typeof adminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders & Shipping', icon: ShoppingBag },
    { id: 'payments', label: 'Payment Gateways & Payouts', icon: CreditCard },
    { id: 'themes', label: 'Themes & Design', icon: Palette },
    { id: 'settings', label: 'Subdomain & Settings', icon: Settings },
  ];

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Bar */}
        <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
                {currentStore.name}
              </h1>
              <span className="text-[11px] font-mono bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Globe className="w-3 h-3 text-amber-600" />
                <span>{currentStore.subdomain}.shopflow.app</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Store Owner Console · Manage inventory, process customer orders, and receive payouts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('storefront')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-xs transition-colors"
              aria-label="View Live Storefront"
            >
              <span>View Customer Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Controls */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 shadow-2xs font-bold'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
                aria-label={tab.label}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
                {tab.id === 'orders' && metrics.pendingCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 text-[10px] flex items-center justify-center font-bold font-mono">
                    {metrics.pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
