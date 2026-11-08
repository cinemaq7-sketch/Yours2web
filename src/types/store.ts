export type ThemeId = 'artisan' | 'minimalist' | 'neotech' | 'royale';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  fontHeading: 'serif' | 'sans' | 'display';
  primaryColor: string;
  accentColor: string;
  bgSurface: string;
  textSurface: string;
  cardRadius: string;
  heroHeadline: string;
  heroSubhead: string;
  heroImage: string;
  announcementText: string;
  showAnnouncement: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
  stockQuantity: number;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export type PaymentMethod = 'razorpay' | 'cashfree' | 'upi_qr' | 'cod';
export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type FulfillmentStatus = 'unfulfilled' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderTimelineItem {
  status: string;
  time: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  storeId: string;
  customer: CustomerInfo;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentDetails?: {
    transactionId?: string;
    upiRef?: string;
    gatewayName?: string;
    feeDeducted?: number;
  };
  trackingNumber?: string;
  courierName?: string;
  createdAt: string;
  timeline: OrderTimelineItem[];
}

export interface RazorpayConfig {
  enabled: boolean;
  keyId: string;
  keySecret: string;
  testMode: boolean;
  webhookSecret: string;
}

export interface CashfreeConfig {
  enabled: boolean;
  appId: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
}

export interface UpiQrConfig {
  enabled: boolean;
  upiId: string;
  merchantName: string;
  autoVerify: boolean;
}

export interface CodConfig {
  enabled: boolean;
  codFee: number;
  minOrderAmount: number;
  maxOrderAmount: number;
}

export interface PaymentGatewayConfig {
  razorpay: RazorpayConfig;
  cashfree: CashfreeConfig;
  upi_qr: UpiQrConfig;
  cod: CodConfig;
}

export interface BankAccountDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface PayoutRecord {
  id: string;
  amount: number;
  status: 'settled' | 'processing';
  utr: string;
  date: string;
}

export interface PayoutSettings {
  bankAccount: BankAccountDetails;
  autoPayoutDays: number;
  totalSettled: number;
  pendingSettlement: number;
  payouts: PayoutRecord[];
}

export interface Store {
  id: string;
  name: string;
  subdomain: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  themeConfig: ThemeConfig;
  categories: string[];
  products: Product[];
  orders: Order[];
  paymentConfig: PaymentGatewayConfig;
  payoutSettings: PayoutSettings;
  createdAt: string;
  ownerEmail: string;
  ownerPhone: string;
  analytics: {
    visits: number;
    views: number;
  };
}
