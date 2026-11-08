import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/storeLogic';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';

interface StorefrontHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { currentStore, cart, setIsCartOpen } = useStore();
  const theme = currentStore.themeConfig;

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const fontClass =
    theme.fontHeading === 'serif'
      ? 'font-serif-luxury'
      : theme.fontHeading === 'display'
      ? 'font-display'
      : 'font-sans-clean';

  return (
    <div className="w-full">
      {/* Optional Slim Announcement Banner */}
      {theme.showAnnouncement && theme.announcementText && (
        <aside
          aria-label="Store announcement"
          className="text-center py-2 px-4 text-xs font-medium tracking-wide transition-colors"
          style={{
            backgroundColor: theme.primaryColor,
            color: '#ffffff',
          }}
        >
          {theme.announcementText}
        </aside>
      )}

      {/* Top Bar Contract: [Brand title] — [4-5 nav links] — [1 primary action] */}
      <header className="border-b border-neutral-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single line, no clutter) */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 ${fontClass}`}
          >
            {currentStore.name}
          </a>

          {/* Zone 2: 4-5 clean single-line category links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                selectedCategory === 'All'
                  ? 'border-neutral-900 text-neutral-950 font-semibold'
                  : 'border-transparent'
              }`}
            >
              All Items
            </button>
            {currentStore.categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                  selectedCategory === cat
                    ? 'border-neutral-900 text-neutral-950 font-semibold'
                    : 'border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action (Cart Drawer Trigger) with embedded search shortcut */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative hidden sm:block w-44 lg:w-56">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-50 border border-neutral-200/80 rounded-full focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all"
              />
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-xs"
              aria-label={`Cart with ${totalCartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="flex items-center gap-1 pl-1.5 border-l border-neutral-700 font-mono">
                  <span>({totalCartCount})</span>
                  <span className="hidden sm:inline">
                    · {formatCurrency(cartSubtotal, currentStore.currencySymbol)}
                  </span>
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
