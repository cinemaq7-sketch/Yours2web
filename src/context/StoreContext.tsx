import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  CustomerInfo,
  FulfillmentStatus,
  Order,
  PaymentGatewayConfig,
  PayoutSettings,
  Product,
  Store,
  ThemeConfig,
  ThemeId,
} from '../types/store';
import { INITIAL_STORES, THEME_TEMPLATES } from '../data/initialStores';
import { advanceOrderState, calculateCartTotals, generateSubdomain } from '../utils/storeLogic';

const STORAGE_KEY = 'shopcraft_stores_v1';
const ACTIVE_STORE_KEY = 'shopcraft_active_store_id';

interface StoreContextType {
  stores: Store[];
  currentStore: Store;
  currentStoreId: string;
  currentView: 'storefront' | 'admin' | 'platform';
  adminTab: 'overview' | 'products' | 'orders' | 'payments' | 'themes' | 'settings';
  cart: CartItem[];
  isCartOpen: boolean;
  activeProductModal: Product | null;
  setCurrentView: (view: 'storefront' | 'admin' | 'platform') => void;
  setAdminTab: (tab: 'overview' | 'products' | 'orders' | 'payments' | 'themes' | 'settings') => void;
  switchStore: (storeIdOrSubdomain: string) => void;
  createStore: (name: string, tagline: string, themeId: ThemeId) => Store;
  updateStore: (updatedFields: Partial<Store>) => void;
  addProduct: (productData: Omit<Product, 'id' | 'slug'>) => Product;
  updateProduct: (productId: string, productData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  setActiveProductModal: (product: Product | null) => void;
  placeOrder: (orderData: {
    customer: CustomerInfo;
    paymentMethod: Order['paymentMethod'];
    paymentDetails?: Order['paymentDetails'];
  }) => Order;
  updateOrderStatus: (
    orderId: string,
    status: FulfillmentStatus,
    options?: { trackingNumber?: string; courierName?: string; note?: string }
  ) => void;
  updatePaymentConfig: (config: Partial<PaymentGatewayConfig>) => void;
  updatePayoutSettings: (settings: Partial<PayoutSettings>) => void;
  triggerManualPayout: () => void;
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_STORES;
  });

  const [currentStoreId, setCurrentStoreId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_STORE_KEY);
      if (savedId && stores.some((s) => s.id === savedId)) return savedId;
    } catch {
      // ignore
    }
    return stores[0]?.id || 'store-aura-crafts';
  });

  const [currentView, setCurrentView] = useState<'storefront' | 'admin' | 'platform'>('storefront');
  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'orders' | 'payments' | 'themes' | 'settings'>('overview');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // Sync stores to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
    } catch {
      // ignore
    }
  }, [stores]);

  // Sync active store id
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_STORE_KEY, currentStoreId);
    } catch {
      // ignore
    }
    // Clear cart when switching store to prevent cross-store items
    setCart([]);
  }, [currentStoreId]);

  const currentStore = stores.find((s) => s.id === currentStoreId) || stores[0];

  const switchStore = (storeIdOrSubdomain: string) => {
    const found = stores.find(
      (s) => s.id === storeIdOrSubdomain || s.subdomain.toLowerCase() === storeIdOrSubdomain.toLowerCase()
    );
    if (found) {
      setCurrentStoreId(found.id);
    }
  };

  const createStore = (name: string, tagline: string, themeId: ThemeId): Store => {
    const subdomain = generateSubdomain(name);
    const themeConfig: ThemeConfig = THEME_TEMPLATES[themeId] || THEME_TEMPLATES.artisan;

    const newStore: Store = {
      id: `store-${Date.now()}`,
      name: name.trim() || 'My Online Store',
      subdomain,
      tagline: tagline.trim() || 'Curated premium products for modern lifestyles',
      currency: 'INR',
      currencySymbol: '₹',
      themeConfig: {
        ...themeConfig,
        heroHeadline: `Welcome to ${name.trim() || 'Our Store'}`,
      },
      categories: ['Featured', 'New Arrivals', 'Bestsellers'],
      ownerEmail: 'merchant@' + subdomain + '.com',
      ownerPhone: '+91 98000 12345',
      createdAt: new Date().toISOString(),
      analytics: {
        visits: 120,
        views: 310,
      },
      paymentConfig: {
        razorpay: {
          enabled: true,
          keyId: 'rzp_test_' + subdomain.slice(0, 8),
          keySecret: 'sec_test_secret',
          testMode: true,
          webhookSecret: 'whsec_' + subdomain.slice(0, 6),
        },
        cashfree: {
          enabled: false,
          appId: '',
          secretKey: '',
          environment: 'sandbox',
        },
        upi_qr: {
          enabled: true,
          upiId: `${subdomain}@okhdfcbank`,
          merchantName: name.trim(),
          autoVerify: true,
        },
        cod: {
          enabled: true,
          codFee: 0,
          minOrderAmount: 200,
          maxOrderAmount: 20000,
        },
      },
      payoutSettings: {
        bankAccount: {
          accountHolder: name.trim() + ' Enterprise',
          bankName: 'HDFC Bank',
          accountNumber: '502000' + Math.floor(10000000 + Math.random() * 90000000),
          ifscCode: 'HDFC0000128',
        },
        autoPayoutDays: 2,
        totalSettled: 0,
        pendingSettlement: 0,
        payouts: [],
      },
      products: [
        {
          id: `prod-${Date.now()}-1`,
          title: 'Signature Collection Item #01',
          slug: 'signature-collection-item-1',
          price: 1499,
          compareAtPrice: 1999,
          category: 'Featured',
          description: 'Handcrafted signature item made with premium materials and ethical workmanship.',
          imageUrl: '/src/assets/images/hero_artisan_crafts_1794134231221.jpg',
          inStock: true,
          stockQuantity: 25,
          featured: true,
          rating: 5.0,
          reviewsCount: 12,
          tags: ['Handcrafted', 'Bestseller'],
        },
      ],
      orders: [],
    };

    setStores((prev) => [newStore, ...prev]);
    setCurrentStoreId(newStore.id);
    return newStore;
  };

  const updateStore = (updatedFields: Partial<Store>) => {
    setStores((prev) =>
      prev.map((s) => (s.id === currentStoreId ? { ...s, ...updatedFields } : s))
    );
  };

  const addProduct = (productData: Omit<Product, 'id' | 'slug'>): Product => {
    const slug = generateSubdomain(productData.title);
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      slug,
      rating: 5.0,
      reviewsCount: 1,
    };

    setStores((prev) =>
      prev.map((s) => {
        if (s.id !== currentStoreId) return s;
        const categories = s.categories.includes(newProduct.category)
          ? s.categories
          : [...s.categories, newProduct.category];
        return {
          ...s,
          categories,
          products: [newProduct, ...s.products],
        };
      })
    );

    return newProduct;
  };

  const updateProduct = (productId: string, productData: Partial<Product>) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id !== currentStoreId) return s;
        return {
          ...s,
          products: s.products.map((p) =>
            p.id === productId ? { ...p, ...productData } : p
          ),
        };
      })
    );
  };

  const deleteProduct = (productId: string) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id !== currentStoreId) return s;
        return {
          ...s,
          products: s.products.filter((p) => p.id !== productId),
        };
      })
    );
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderData: {
    customer: CustomerInfo;
    paymentMethod: Order['paymentMethod'];
    paymentDetails?: Order['paymentDetails'];
  }): Order => {
    const totals = calculateCartTotals(cart, 0, orderData.paymentMethod === 'cod' ? currentStore.paymentConfig.cod.codFee : 0);
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString();

    const isPaid = orderData.paymentMethod !== 'cod';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      storeId: currentStore.id,
      customer: orderData.customer,
      items: cart.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
      })),
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      discount: totals.discount,
      total: totals.total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: isPaid ? 'paid' : 'pending',
      fulfillmentStatus: 'unfulfilled',
      paymentDetails: orderData.paymentDetails,
      createdAt: now.toISOString(),
      timeline: [
        {
          status: 'ORDER PLACED',
          time: timeFormatted,
          description: `Order placed via ${orderData.paymentMethod.toUpperCase()}${isPaid ? ' - Payment Confirmed' : ' - COD verification pending'}`,
        },
      ],
    };

    // Update store orders, pending settlement, and deduct stock
    setStores((prev) =>
      prev.map((s) => {
        if (s.id !== currentStoreId) return s;

        // Deduct inventory
        const updatedProducts = s.products.map((p) => {
          const cartMatch = cart.find((c) => c.product.id === p.id);
          if (cartMatch) {
            const newStock = Math.max(0, p.stockQuantity - cartMatch.quantity);
            return {
              ...p,
              stockQuantity: newStock,
              inStock: newStock > 0,
            };
          }
          return p;
        });

        // Add to pending settlements if paid online
        const newPending = isPaid
          ? s.payoutSettings.pendingSettlement + totals.total
          : s.payoutSettings.pendingSettlement;

        return {
          ...s,
          products: updatedProducts,
          orders: [newOrder, ...s.orders],
          payoutSettings: {
            ...s.payoutSettings,
            pendingSettlement: newPending,
          },
        };
      })
    );

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: FulfillmentStatus,
    options?: { trackingNumber?: string; courierName?: string; note?: string }
  ) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id !== currentStoreId) return s;
        return {
          ...s,
          orders: s.orders.map((order) => {
            if (order.id !== orderId) return order;
            return advanceOrderState(order, status, options);
          }),
        };
      })
    );
  };

  const updatePaymentConfig = (config: Partial<PaymentGatewayConfig>) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id !== currentStoreId) return s;
        return {
          ...s,
          paymentConfig: {
            ...s.paymentConfig,
            ...config,
          },
        };
      })
    );
  };

  const updatePayoutSettings = (settings: Partial<PayoutSettings>) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id !== currentStoreId) return s;
        return {
          ...s,
          payoutSettings: {
            ...s.payoutSettings,
            ...settings,
          },
        };
      })
    );
  };

  const triggerManualPayout = () => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id !== currentStoreId) return s;
        const pending = s.payoutSettings.pendingSettlement;
        if (pending <= 0) return s;

        const newPayout = {
          id: `pay_${Date.now()}`,
          amount: pending,
          status: 'settled' as const,
          utr: `BANK${new Date().getFullYear()}${Math.floor(100000000 + Math.random() * 900000000)}`,
          date: new Date().toISOString().split('T')[0],
        };

        return {
          ...s,
          payoutSettings: {
            ...s.payoutSettings,
            totalSettled: s.payoutSettings.totalSettled + pending,
            pendingSettlement: 0,
            payouts: [newPayout, ...s.payoutSettings.payouts],
          },
        };
      })
    );
  };

  const resetDemoData = () => {
    setStores(INITIAL_STORES);
    setCurrentStoreId(INITIAL_STORES[0].id);
    setCart([]);
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        currentStore,
        currentStoreId,
        currentView,
        adminTab,
        cart,
        isCartOpen,
        activeProductModal,
        setCurrentView,
        setAdminTab,
        switchStore,
        createStore,
        updateStore,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        setIsCartOpen,
        setActiveProductModal,
        placeOrder,
        updateOrderStatus,
        updatePaymentConfig,
        updatePayoutSettings,
        triggerManualPayout,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
