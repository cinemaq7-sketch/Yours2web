import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSubdomain,
  formatCurrency,
  calculateCartTotals,
  validateCustomerCheckout,
  generateUpiUri,
  advanceOrderState,
  calculateStoreMetrics,
} from './storeLogic';
import { Order, CartItem } from '../types/store';

test('generateSubdomain creates clean URL-friendly slugs', () => {
  assert.equal(generateSubdomain('Aura Handlooms & Crafts!'), 'aura-handlooms-crafts');
  assert.equal(generateSubdomain('  My Store 2026  '), 'my-store-2026');
  assert.equal(generateSubdomain(''), 'mystore');
  assert.equal(generateSubdomain('$$$'), 'mystore');
});

test('formatCurrency formats Indian and international amounts cleanly', () => {
  assert.equal(formatCurrency(1499, '₹'), '₹1,499');
  assert.equal(formatCurrency(0, '₹'), '₹0');
  assert.equal(formatCurrency(24.5, '$'), '$24.50');
});

test('calculateCartTotals computes subtotal, free shipping threshold, and taxes', () => {
  const dummyItem: CartItem = {
    product: {
      id: 'p1',
      title: 'Ceramic Mug',
      slug: 'ceramic-mug',
      price: 500,
      category: 'Home',
      description: 'Handmade mug',
      imageUrl: '/placeholder.jpg',
      inStock: true,
      stockQuantity: 10,
      tags: ['ceramic'],
    },
    quantity: 2, // 1000 total (>= 999 threshold -> free shipping)
  };

  const totals = calculateCartTotals([dummyItem], 10, 0); // 10% discount
  assert.equal(totals.subtotal, 1000);
  assert.equal(totals.discount, 100);
  assert.equal(totals.shipping, 0); // Free shipping
  assert.equal(totals.tax, 45); // 5% of 900
  assert.equal(totals.total, 945);
});

test('calculateCartTotals adds flat shipping for orders below threshold', () => {
  const lowItem: CartItem = {
    product: {
      id: 'p2',
      title: 'Wooden Spoon',
      slug: 'wooden-spoon',
      price: 250,
      category: 'Home',
      description: 'Carved spoon',
      imageUrl: '/placeholder.jpg',
      inStock: true,
      stockQuantity: 5,
      tags: ['wood'],
    },
    quantity: 1, // 250 total (< 999 threshold -> flat 50 shipping)
  };

  const totals = calculateCartTotals([lowItem], 0, 0);
  assert.equal(totals.subtotal, 250);
  assert.equal(totals.shipping, 50);
  assert.equal(totals.tax, 13);
  assert.equal(totals.total, 313);
});

test('validateCustomerCheckout catches missing or malformed inputs', () => {
  const invalid = validateCustomerCheckout({
    name: 'A',
    email: 'bad-email',
    phone: '123',
    address: 'st',
    city: '',
    state: '',
    pincode: '99',
  });

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.address);
  assert.ok(invalid.errors.city);
  assert.ok(invalid.errors.pincode);

  const valid = validateCustomerCheckout({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543210',
    address: 'Plot 42, Jubilee Hills Road 36',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
  });

  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('generateUpiUri produces valid URI with parameters', () => {
  const uri = generateUpiUri('merchant@okhdfcbank', 'Aura Crafts', 1299, 'ORD-101');
  assert.ok(uri.startsWith('upi://pay?'));
  assert.ok(uri.includes('pa=merchant@okhdfcbank'));
  assert.ok(uri.includes('am=1299.00'));
  assert.ok(uri.includes('tr=ORD-101'));
});

test('advanceOrderState transitions fulfillment and updates timeline', () => {
  const baseOrder: Order = {
    id: 'ord-1',
    orderNumber: 'ORD-7001',
    storeId: 'store-1',
    customer: {
      name: 'Ravi Teja',
      email: 'ravi@example.com',
      phone: '9848022338',
      address: 'Main Street',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520001',
    },
    items: [],
    subtotal: 1000,
    tax: 50,
    shipping: 0,
    discount: 0,
    total: 1050,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    fulfillmentStatus: 'unfulfilled',
    createdAt: new Date().toISOString(),
    timeline: [
      { status: 'CREATED', time: '10:00 AM', description: 'Order placed' },
    ],
  };

  const confirmed = advanceOrderState(baseOrder, 'confirmed');
  assert.equal(confirmed.fulfillmentStatus, 'confirmed');
  assert.equal(confirmed.timeline.length, 2);

  const shipped = advanceOrderState(confirmed, 'shipped', {
    trackingNumber: 'DELHIVERY-9988',
    courierName: 'Delhivery',
  });
  assert.equal(shipped.fulfillmentStatus, 'shipped');
  assert.equal(shipped.trackingNumber, 'DELHIVERY-9988');

  const delivered = advanceOrderState(shipped, 'delivered');
  assert.equal(delivered.fulfillmentStatus, 'delivered');
  // For COD, delivery settles payment to 'paid'
  assert.equal(delivered.paymentStatus, 'paid');
});

test('calculateStoreMetrics aggregates order counts and revenue', () => {
  const mockOrders: Order[] = [
    {
      id: 'o1',
      orderNumber: 'ORD-1',
      storeId: 's1',
      customer: {} as any,
      items: [],
      subtotal: 1000,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 1000,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      fulfillmentStatus: 'delivered',
      createdAt: '',
      timeline: [],
    },
    {
      id: 'o2',
      orderNumber: 'ORD-2',
      storeId: 's1',
      customer: {} as any,
      items: [],
      subtotal: 2000,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 2000,
      paymentMethod: 'upi_qr',
      paymentStatus: 'paid',
      fulfillmentStatus: 'shipped',
      createdAt: '',
      timeline: [],
    },
    {
      id: 'o3',
      orderNumber: 'ORD-3',
      storeId: 's1',
      customer: {} as any,
      items: [],
      subtotal: 500,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 500,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      fulfillmentStatus: 'unfulfilled',
      createdAt: '',
      timeline: [],
    },
  ];

  const metrics = calculateStoreMetrics(mockOrders);
  assert.equal(metrics.totalOrders, 3);
  assert.equal(metrics.totalRevenue, 3000); // Only paid orders
  assert.equal(metrics.averageOrderValue, 1000); // 3000 / 3
  assert.equal(metrics.pendingCount, 1);
  assert.equal(metrics.shippedCount, 1);
  assert.equal(metrics.deliveredCount, 1);
});
