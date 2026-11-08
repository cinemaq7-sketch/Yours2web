import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { generateSubdomain } from '../../utils/storeLogic';
import { Globe, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { currentStore, updateStore, resetDemoData, switchStore } = useStore();

  const [name, setName] = useState(currentStore.name);
  const [subdomain, setSubdomain] = useState(currentStore.subdomain);
  const [tagline, setTagline] = useState(currentStore.tagline);
  const [currencySymbol, setCurrencySymbol] = useState(currentStore.currencySymbol);
  const [currency, setCurrency] = useState(currentStore.currency);
  const [ownerEmail, setOwnerEmail] = useState(currentStore.ownerEmail);
  const [ownerPhone, setOwnerPhone] = useState(currentStore.ownerPhone);

  const [saveAlert, setSaveAlert] = useState(false);

  const handleSubdomainChange = (val: string) => {
    setSubdomain(generateSubdomain(val));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStore({
      name,
      subdomain: generateSubdomain(subdomain),
      tagline,
      currency,
      currencySymbol,
      ownerEmail,
      ownerPhone,
    });
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-neutral-900">Subdomain & Store Settings</h2>
        <p className="text-xs text-neutral-500">
          Configure your dedicated subdomain address, store branding, and contact details
        </p>
      </div>

      {saveAlert && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Store settings and subdomain updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-2xs space-y-5 text-xs">
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Store Brand Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-sm font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Assigned Store Subdomain *
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-neutral-100 border border-r-0 border-neutral-200 rounded-l-lg text-neutral-500 font-mono text-xs">
                https://
              </span>
              <input
                type="text"
                required
                value={subdomain}
                onChange={(e) => handleSubdomainChange(e.target.value)}
                className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-none focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono font-semibold text-neutral-900"
              />
              <span className="px-3 py-2 bg-neutral-100 border border-l-0 border-neutral-200 rounded-r-lg text-neutral-600 font-mono text-xs">
                .shopflow.app
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Your customer storefront is immediately reachable at this live URL.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Store Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Brief description displayed on meta tags and invoice headers"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Store Currency
              </label>
              <select
                value={currency}
                onChange={(e) => {
                  const curr = e.target.value;
                  setCurrency(curr);
                  setCurrencySymbol(curr === 'INR' ? '₹' : curr === 'USD' ? '$' : '€');
                }}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="INR">Indian Rupee (₹ INR)</option>
                <option value="USD">US Dollar ($ USD)</option>
                <option value="EUR">Euro (€ EUR)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Merchant Contact Email
              </label>
              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Merchant Support Phone
              </label>
              <input
                type="tel"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset demo data to initial state?')) {
                resetDemoData();
              }
            }}
            className="text-[11px] text-neutral-500 hover:text-neutral-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Stores</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold shadow-xs"
          >
            Save Store Settings
          </button>
        </div>
      </form>
    </div>
  );
};
