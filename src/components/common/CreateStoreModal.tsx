import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ThemeId } from '../../types/store';
import { THEME_TEMPLATES } from '../../data/initialStores';
import { generateSubdomain } from '../../utils/storeLogic';
import { X, Sparkles, Store, Check, ArrowRight } from 'lucide-react';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateStoreModal: React.FC<CreateStoreModalProps> = ({ isOpen, onClose }) => {
  const { createStore, setCurrentView } = useStore();
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('artisan');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const previewSubdomain = generateSubdomain(name || 'my-store');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for your store.');
      return;
    }
    setError('');
    createStore(name, tagline, selectedTheme);
    setCurrentView('admin');
    onClose();
    setName('');
    setTagline('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900 text-base">Create New E-Commerce Store</h2>
              <p className="text-xs text-neutral-500">Launch with dedicated subdomain & payment gateways</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Store Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Silk Boutique, ByteCraft Gadgets"
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Assigned Subdomain (Auto-generated)
            </label>
            <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-lg px-3.5 py-2 text-xs font-mono text-neutral-700">
              <span className="text-amber-600 font-semibold">{previewSubdomain}</span>
              <span className="text-neutral-500">.shopflow.app</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Customers will access your storefront at this live address.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Tagline / Subheading
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Handcrafted textiles made from organic bamboo fibers"
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Select Theme Template
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(THEME_TEMPLATES) as ThemeId[]).map((tid) => {
                const t = THEME_TEMPLATES[tid];
                const isSelected = selectedTheme === tid;
                return (
                  <button
                    key={tid}
                    type="button"
                    onClick={() => setSelectedTheme(tid)}
                    className={`flex items-start gap-2.5 p-3 text-left rounded-xl border transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/30 ring-1 ring-amber-500'
                        : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full shrink-0 mt-0.5 border flex items-center justify-center"
                      style={{ backgroundColor: t.primaryColor }}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="font-medium text-xs text-neutral-900">{t.name}</div>
                      <div className="text-[11px] text-neutral-500 capitalize">{t.fontHeading} font</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm"
            >
              <span>Launch Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
