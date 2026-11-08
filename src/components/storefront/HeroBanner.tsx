import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  const { currentStore } = useStore();
  const theme = currentStore.themeConfig;

  const fontClass =
    theme.fontHeading === 'serif'
      ? 'font-serif-luxury'
      : theme.fontHeading === 'display'
      ? 'font-display'
      : 'font-sans-clean';

  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white min-h-[460px] flex items-center">
      {/* Background Media with Dark Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={theme.heroImage}
          alt={theme.heroHeadline}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-45 scale-102 transition-transform duration-700"
          onError={(e) => {
            // Stylized CSS fallback on error
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
            <span>{currentStore.subdomain}.shopflow.app</span>
            <span aria-hidden="true">·</span>
            <span>Verified Merchant Store</span>
          </div>

          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] [text-wrap:balance] ${fontClass}`}
          >
            {theme.heroHeadline}
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
            {theme.heroSubhead}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-2 hover:opacity-90 active:scale-98"
              style={{
                backgroundColor: theme.accentColor || '#d97706',
                color: '#ffffff',
              }}
            >
              <span>Explore Collection</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <div className="text-xs text-neutral-400 flex items-center gap-2">
              <span>Fast Dispatch</span>
              <span aria-hidden="true">·</span>
              <span>Online UPI / Razorpay / COD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
