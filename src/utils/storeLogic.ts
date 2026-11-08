import { CartItem, CustomerInfo, FulfillmentStatus, Order, OrderTimelineItem } from '../types/store';

/**
 * Sanitizes and generates an RFC-compliant subdomain slug from a store name
 */
export function generateSubdomain(name: string): string {
  if (!name || !name.trim()) return 'mystore';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'mystore';
}

/**
 * Formats a numeric price into a localized currency string
 */
export function formatCurrency(amount: number, symbol = '₹'): string {
  const hasDecimals = amount % 1 !== 0;
  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

/**
 * Calculates cart subtotal, shipping fee, tax, discount, and final total
 */
export function calculateCartTotals(
  items: CartItem[],
  discountPercent = 0,
  codFee = 0,
  freeShippingThreshold = 999,
  flatShippingRate = 50
): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const eligibleForFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shipping = eligibleForFreeShipping ? 0 : flatShippingRate;
  const tax = Math.round((subtotal - discount) * 0.05); // 5% standard GST
  const total = Math.max(0, subtotal - discount + shipping + tax + codFee);

  return {
    subtotal,
    tax,
    shipping,
    discount,
    total,
  };
}

/**
 * Validates checkout form customer fields
 */
export function validateCustomerCheckout(customer: CustomerInfo): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!customer.name || customer.name.trim().length < 2) {
    errors.name = 'Full name is required (min 2 characters)';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customer.email || !emailRegex.test(customer.email.trim())) {
    errors.email = 'Valid email address is required';
  }

  const cleanPhone = customer.phone ? customer.phone.replace(/[\s-]/g, '') : '';
  if (!cleanPhone || cleanPhone.length < 10) {
    errors.phone = 'Valid 10-digit phone number is required';
  }

  if (!customer.address || customer.address.trim().length < 5) {
    errors.address = 'Detailed delivery address is required';
  }

  if (!customer.city || customer.city.trim().length < 2) {
    errors.city = 'City is required';
  }

  if (!customer.pincode || !/^\d{5,6}$/.test(customer.pincode.trim())) {
    errors.pincode = 'Valid 5 or 6-digit postal PIN code is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates UPI payment intent URI (for instant QR code & mobile intent)
 */
export function generateUpiUri(
  upiId: string,
  payeeName: string,
  amount: number,
  orderNumber: string
): string {
  const cleanUpi = upiId.trim();
  const cleanName = encodeURIComponent(payeeName.trim());
  const cleanNote = encodeURIComponent(`Order ${orderNumber}`);
  const formattedAmount = amount.toFixed(2);

  return `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${formattedAmount}&cu=INR&tn=${cleanNote}&tr=${orderNumber}`;
}

/**
 * Advances order lifecycle state with timestamped history
 */
export function advanceOrderState(
  order: Order,
  nextStatus: FulfillmentStatus,
  options?: { trackingNumber?: string; courierName?: string; note?: string }
): Order {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString();
  let description = '';

  switch (nextStatus) {
    case 'confirmed':
      description = 'Order verified and sent to warehouse packing';
      break;
    case 'shipped':
      description = `Dispatched with ${options?.courierName || 'Courier Partner'}. Tracking: ${options?.trackingNumber || 'IN-EXP-' + Math.floor(100000 + Math.random() * 900000)}`;
      break;
    case 'delivered':
      description = 'Parcel delivered successfully to customer';
      break;
    case 'cancelled':
      description = options?.note || 'Order cancelled by store owner';
      break;
    default:
      description = 'Status updated';
  }

  const newTimelineItem: OrderTimelineItem = {
    status: nextStatus.toUpperCase(),
    time: timestamp,
    description,
  };

  return {
    ...order,
    fulfillmentStatus: nextStatus,
    paymentStatus: nextStatus === 'delivered' && order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus,
    trackingNumber: options?.trackingNumber || order.trackingNumber,
    courierName: options?.courierName || order.courierName,
    timeline: [...order.timeline, newTimelineItem],
  };
}

/**
 * Computes business metrics from orders
 */
export function calculateStoreMetrics(orders: Order[]): {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingCount: number;
  shippedCount: number;
  deliveredCount: number;
} {
  const validOrders = orders.filter((o) => o.fulfillmentStatus !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrders = validOrders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const pendingCount = orders.filter((o) => o.fulfillmentStatus === 'unfulfilled' || o.fulfillmentStatus === 'confirmed').length;
  const shippedCount = orders.filter((o) => o.fulfillmentStatus === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.fulfillmentStatus === 'delivered').length;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    pendingCount,
    shippedCount,
    deliveredCount,
  };
}
