import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ThemeId, ThemeConfig } from '../../types/store';
import { THEME_TEMPLATES } from '../../data/initialStores';
import { Palette, Check, Sparkles, Eye } from 'lucide-react';

export const AdminThemes: React.FC = () => {
  const { currentStore, updateStore, setCurrentView } = useStore();
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>(
    currentStore.themeConfig.id || 'artisan'
  );

  const [announcementText, setAnnouncementText] = useState(
    currentStore.themeConfig.announcementText
  );
  const [showAnnouncement, setShowAnnouncement] = useState(
    currentStore.themeConfig.showAnnouncement
  );
  const [heroHeadline, setHeroHeadline] = useState(
    currentStore.themeConfig.heroHeadline
  );
  const [heroSubhead, setHeroSubhead] = useState(
    currentStore.themeConfig.heroSubhead
  );
  const [accentColor, setAccentColor] = useState(
    currentStore.themeConfig.accentColor || '#d97706'
  );

  const [savedAlert, setSavedAlert] = useState(false);

  const handleApplyTheme = (themeId: ThemeId) => {
    setSelectedThemeId(themeId);
    const template = THEME_TEMPLATES[themeId];
    updateStore({
      themeConfig: {
        ...template,
        announcementText,
        showAnnouncement,
        heroHeadline: template.heroHeadline,
        heroSubhead: template.heroSubhead,
      },
    });
    setHeroHeadline(template.heroHeadline);
    setHeroSubhead(template.heroSubhead);
    setAccentColor(template.accentColor);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const handleSaveCustomizations = (e: React.FormEvent) => {
    e.preventDefault();
    updateStore({
      themeConfig: {
        ...currentStore.themeConfig,
        announcementText,
        showAnnouncement,
        heroHeadline,
        heroSubhead,
        accentColor,
      },
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-neutral-900">Store Theme & Visual Identity</h2>
        <p className="text-xs text-neutral-500">
          Select curated storefront designs and customize campaign headlines, fonts, and brand colors
        </p>
      </div>

      {savedAlert && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
          Theme configuration updated! Check your live customer storefront.
        </div>
      )}

      {/* Curated Theme Templates Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-900">Select Store Template</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(THEME_TEMPLATES) as ThemeId[]).map((tid) => {
            const theme = THEME_TEMPLATES[tid];
            const isCurrent = currentStore.themeConfig.id === tid;
            return (
              <div
                key={tid}
                className={`flex flex-col justify-between rounded-xl border p-4 bg-white transition-all ${
                  isCurrent
                    ? 'border-neutral-900 ring-2 ring-neutral-900 shadow-md'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Theme Thumbnail Preview Box */}
                  <div
                    className="aspect-16/10 rounded-lg overflow-hidden relative p-3 flex flex-col justify-between"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <div className="flex justify-between items-center text-white/80 text-[10px]">
                      <span className="font-semibold uppercase tracking-wider">{theme.name}</span>
                      <span className="capitalize">{theme.fontHeading}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 w-16 bg-white/60 rounded" />
                      <div className="h-1 w-24 bg-white/40 rounded" />
                    </div>
                    <div
                      className="self-start px-2 py-0.5 rounded text-[9px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      Shop Now
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-neutral-900">{theme.name}</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5 capitalize">
                      {theme.fontHeading} headline typography
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handleApplyTheme(tid)}
                    className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                  >
                    {isCurrent ? 'Active Theme' : 'Apply Theme'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme Customizer Form */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-2xs space-y-5">
        <div className="border-b pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-neutral-900">Customizer & Content Overrides</h3>
            <p className="text-xs text-neutral-500">Fine-tune announcement banner, hero copy, and colors</p>
          </div>
          <button
            onClick={() => setCurrentView('storefront')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Storefront</span>
          </button>
        </div>

        <form onSubmit={handleSaveCustomizations} className="space-y-4 text-xs">
          {/* Announcement Bar Toggle */}
          <div className="p-4 bg-neutral-50 rounded-xl space-y-3 border border-neutral-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-900">Top Announcement Banner</span>
                <p className="text-[11px] text-neutral-500">Displays a prominent bar at the top of your shop</p>
              </div>
              <input
                type="checkbox"
                checked={showAnnouncement}
                onChange={(e) => setShowAnnouncement(e.target.checked)}
                className="w-4 h-4 text-neutral-900 rounded border-neutral-300"
              />
            </div>

            {showAnnouncement && (
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Banner Text
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Free Express Shipping on orders above ₹999 across India"
                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            )}
          </div>

          {/* Hero Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">
                Hero Headline (Campaign Title)
              </label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                placeholder="e.g. Handcrafted Heritage, Rooted in Nature"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">
                Hero Subheading
              </label>
              <textarea
                rows={2}
                value={heroSubhead}
                onChange={(e) => setHeroSubhead(e.target.value)}
                placeholder="Describe your craft, materials, and offerings in 1-2 sentences"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Primary Button / Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-8 rounded border border-neutral-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded font-mono uppercase text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Save Customizations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
