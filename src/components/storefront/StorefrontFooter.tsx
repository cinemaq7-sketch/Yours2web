import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, Globe, ArrowUpRight } from 'lucide-react';

export const StorefrontFooter: React.FC = () => {
  const { currentStore, setCurrentView } = useStore();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-900 text-neutral-300 py-12 px-4 sm:px-6 lg:px-8 mt-16 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-tight">
              {currentStore.name}
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
              {currentStore.subdomain}.shopflow.app
            </span>
          </div>
          <p className="text-neutral-400 max-w-sm leading-relaxed">
            {currentStore.tagline}
          </p>
          <div className="pt-2 text-[11px] text-neutral-500">
            Support: {currentStore.ownerEmail} · {currentStore.ownerPhone}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
            Buyer Guarantee
          </h4>
          <ul className="space-y-1.5 text-neutral-400">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Genuine Products</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>256-Bit Encrypted Payments</span>
            </li>
            <li>Free Express Delivery on orders &gt; ₹999</li>
            <li>7-Day Easy Return Policy</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
            Store Administration
          </h4>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Are you the store merchant? Access your dashboard to manage products, view incoming orders, and track bank payouts.
          </p>
          <button
            onClick={() => setCurrentView('admin')}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Open Owner Dashboard</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px]">
        <div>
          © {new Date().getFullYear()} {currentStore.name}. Powered by ShopCraft E-Commerce Engine.
        </div>
        <div className="flex items-center gap-4">
          <span>Razorpay Verified</span>
          <span aria-hidden="true">·</span>
          <span>Instant UPI Accepted</span>
          <span aria-hidden="true">·</span>
          <span>Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
};
