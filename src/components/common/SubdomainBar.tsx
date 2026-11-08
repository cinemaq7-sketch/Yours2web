import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Globe, ExternalLink, Copy, Check, Store as StoreIcon, ShieldCheck, Plus, Sparkles } from 'lucide-react';

interface SubdomainBarProps {
  onOpenCreateModal: () => void;
}

export const SubdomainBar: React.FC<SubdomainBarProps> = ({ onOpenCreateModal }) => {
  const {
    stores,
    currentStore,
    currentView,
    setCurrentView,
    switchStore,
  } = useStore();

  const [copied, setCopied] = useState(false);

  const fullDomain = `https://${currentStore.subdomain}.shopflow.app`;

  const copyDomain = () => {
    navigator.clipboard.writeText(fullDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900 text-neutral-200 border-b border-neutral-800 text-xs px-3 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Subdomain & Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700/60 font-mono text-[11px] text-amber-300">
            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-neutral-400">https://</span>
            <span className="font-semibold text-white">{currentStore.subdomain}</span>
            <span className="text-neutral-400">.shopflow.app</span>
            <button
              onClick={copyDomain}
              title="Copy store subdomain URL"
              className="ml-1 text-neutral-400 hover:text-white transition-colors"
              aria-label="Copy Subdomain Link"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* Quick Store Switcher dropdown */}
          <div className="relative flex items-center">
            <label htmlFor="store-select" className="sr-only">Switch Store</label>
            <select
              id="store-select"
              value={currentStore.id}
              onChange={(e) => switchStore(e.target.value)}
              className="bg-neutral-800 text-neutral-200 hover:bg-neutral-750 border border-neutral-700 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.subdomain}.shopflow.app)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium px-2 py-1 rounded transition-colors whitespace-nowrap"
            aria-label="Create New Store"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Store</span>
          </button>
        </div>

        {/* Right: View Modes (Storefront vs Owner Admin) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-800 p-0.5 rounded-lg border border-neutral-700">
            <button
              onClick={() => setCurrentView('storefront')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                currentView === 'storefront'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              aria-label="View Customer Storefront"
            >
              <StoreIcon className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                currentView === 'admin'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              aria-label="View Owner Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
