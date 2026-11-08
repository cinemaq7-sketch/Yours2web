import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerInfo, Order, PaymentMethod } from '../../types/store';
import {
  calculateCartTotals,
  formatCurrency,
  generateUpiUri,
  validateCustomerCheckout,
} from '../../utils/storeLogic';
import {
  X,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { currentStore, cart, placeOrder } = useStore();

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Telangana',
    pincode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('razorpay');
  const [upiRefInput, setUpiRefInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Simulated Razorpay Modal State
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('829');

  if (!isOpen) return null;

  const paymentCfg = currentStore.paymentConfig;
  const codFee = selectedMethod === 'cod' ? paymentCfg.cod.codFee : 0;
  const totals = calculateCartTotals(cart, 0, codFee);

  // Demo Autofill for rapid review
  const handleAutofillDemo = () => {
    setCustomer({
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '9848022338',
      address: 'Flat 402, Lotus Towers, Rd No 12, Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      notes: 'Please leave with security if unavailable',
    });
    setErrors({});
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCustomerCheckout(customer);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});

    if (selectedMethod === 'razorpay') {
      setIsRazorpayModalOpen(true);
    } else if (selectedMethod === 'cashfree') {
      simulateGatewayOrder('Cashfree Payments');
    } else if (selectedMethod === 'upi_qr') {
      // Complete UPI order
      const order = placeOrder({
        customer,
        paymentMethod: 'upi_qr',
        paymentDetails: {
          gatewayName: 'Direct UPI QR',
          upiRef: upiRefInput.trim() || `UPI/NPCI/${Math.floor(100000000 + Math.random() * 900000000)}`,
          transactionId: `TXN-UPI-${Date.now().toString().slice(-6)}`,
        },
      });
      setConfirmedOrder(order);
    } else {
      // Cash on Delivery
      const order = placeOrder({
        customer,
        paymentMethod: 'cod',
        paymentDetails: {
          gatewayName: 'Cash on Delivery',
        },
      });
      setConfirmedOrder(order);
    }
  };

  const simulateGatewayOrder = (gatewayName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsRazorpayModalOpen(false);
      const order = placeOrder({
        customer,
        paymentMethod: selectedMethod,
        paymentDetails: {
          gatewayName,
          transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          feeDeducted: Math.round(totals.total * 0.02), // 2% gateway fee
        },
      });
      setConfirmedOrder(order);
    }, 1200);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(paymentCfg.upi_qr.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-neutral-200">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{confirmedOrder ? 'Order Confirmed' : 'Secure Checkout'}</span>
            </h2>
            <p className="text-xs text-neutral-400">
              {currentStore.name} ({currentStore.subdomain}.shopflow.app)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation State View */}
        {confirmedOrder ? (
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-600">
                Payment & Order Verified
              </span>
              <h3 className="text-2xl font-bold text-neutral-900">
                Thank You, {confirmedOrder.customer.name.split(' ')[0]}!
              </h3>
              <p className="text-xs text-neutral-500">
                Order <strong className="font-mono text-neutral-900">#{confirmedOrder.orderNumber}</strong> has been received by the merchant.
              </p>
            </div>

            {/* Live Fulfillment Timeline Steps */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 space-y-3">
              <h4 className="text-xs font-semibold text-neutral-900">Live Order Status</h4>
              <div className="flex items-center justify-between text-center relative">
                <div className="flex flex-col items-center z-10">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    ✓
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-800 mt-1">Placed</span>
                </div>
                <div className="h-0.5 flex-1 bg-neutral-200 -mt-4 mx-2" />
                <div className="flex flex-col items-center z-10">
                  <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-medium">
                    2
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1">Packing</span>
                </div>
                <div className="h-0.5 flex-1 bg-neutral-200 -mt-4 mx-2" />
                <div className="flex flex-col items-center z-10">
                  <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-medium">
                    3
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1">Shipped</span>
                </div>
                <div className="h-0.5 flex-1 bg-neutral-200 -mt-4 mx-2" />
                <div className="flex flex-col items-center z-10">
                  <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-medium">
                    4
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1">Delivered</span>
                </div>
              </div>
            </div>

            {/* Receipt Summary Box */}
            <div className="border border-neutral-200 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <div>
                  <span className="text-neutral-500">Shipping to:</span>
                  <div className="font-semibold text-neutral-900">{confirmedOrder.customer.name}</div>
                  <div className="text-neutral-600">
                    {confirmedOrder.customer.address}, {confirmedOrder.customer.city} - {confirmedOrder.customer.pincode}
                  </div>
                  <div className="text-neutral-500">Phone: {confirmedOrder.customer.phone}</div>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500">Payment:</span>
                  <div className="font-semibold text-neutral-900 uppercase">
                    {confirmedOrder.paymentMethod.replace('_', ' ')}
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mt-1 ${
                    confirmedOrder.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {confirmedOrder.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Items ordered */}
              <div className="space-y-1.5 py-1">
                {confirmedOrder.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span>
                      {item.title} <span className="text-neutral-400">× {item.quantity}</span>
                    </span>
                    <span className="font-mono tabular-nums font-medium">
                      {formatCurrency(item.price * item.quantity, currentStore.currencySymbol)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 flex justify-between font-bold text-sm text-neutral-900">
                <span>Total Amount Paid / Due:</span>
                <span className="font-mono text-base">
                  {formatCurrency(confirmedOrder.total, currentStore.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={printReceipt}
                className="flex-1 py-2.5 px-4 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold"
              >
                Done & Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Active Checkout Form */
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-6">
            {/* Quick Demo Autofill CTA */}
            <div className="flex items-center justify-between p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Want to test quickly without typing?</span>
              </div>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold transition-colors"
              >
                Autofill Test Info
              </button>
            </div>

            {/* Step 1: Shipping Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center">
                  1
                </span>
                <span>Shipping Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                  {errors.name && <span className="text-[10px] text-red-600">{errors.name}</span>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Phone Number (for Courier SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                  {errors.phone && <span className="text-[10px] text-red-600">{errors.phone}</span>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="order-receipt@example.com"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                  {errors.email && <span className="text-[10px] text-red-600">{errors.email}</span>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="House/Flat No, Landmark, Street"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                  {errors.address && <span className="text-[10px] text-red-600">{errors.address}</span>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                  {errors.city && <span className="text-[10px] text-red-600">{errors.city}</span>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Postal PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={customer.pincode}
                    onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                    placeholder="6 digits"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white font-mono"
                  />
                  {errors.pincode && <span className="text-[10px] text-red-600">{errors.pincode}</span>}
                </div>
              </div>
            </div>

            {/* Step 2: Payment Gateway Selection */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center">
                  2
                </span>
                <span>Payment Method</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Razorpay Gateway */}
                {paymentCfg.razorpay.enabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('razorpay')}
                    className={`flex items-start gap-3 p-3.5 text-left rounded-xl border transition-all ${
                      selectedMethod === 'razorpay'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 shrink-0 mt-0.5 text-blue-400" />
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1.5">
                        <span>Razorpay Gateway</span>
                        <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono">
                          Cards / Netbanking
                        </span>
                      </div>
                      <div className={`text-[11px] mt-0.5 ${selectedMethod === 'razorpay' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        All Indian Cards, Netbanking & UPI
                      </div>
                    </div>
                  </button>
                )}

                {/* Direct UPI QR */}
                {paymentCfg.upi_qr.enabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi_qr')}
                    className={`flex items-start gap-3 p-3.5 text-left rounded-xl border transition-all ${
                      selectedMethod === 'upi_qr'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <QrCode className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1.5">
                        <span>Direct UPI QR</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                          Instant 0% Fee
                        </span>
                      </div>
                      <div className={`text-[11px] mt-0.5 ${selectedMethod === 'upi_qr' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Scan with GPay, PhonePe or Paytm
                      </div>
                    </div>
                  </button>
                )}

                {/* Cashfree Payments */}
                {paymentCfg.cashfree.enabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cashfree')}
                    className={`flex items-start gap-3 p-3.5 text-left rounded-xl border transition-all ${
                      selectedMethod === 'cashfree'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-purple-400" />
                    <div>
                      <div className="font-semibold text-xs">Cashfree Payments</div>
                      <div className={`text-[11px] mt-0.5 ${selectedMethod === 'cashfree' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Fast checkout & Wallets
                      </div>
                    </div>
                  </button>
                )}

                {/* Cash on Delivery (COD) */}
                {paymentCfg.cod.enabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cod')}
                    className={`flex items-start gap-3 p-3.5 text-left rounded-xl border transition-all ${
                      selectedMethod === 'cod'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <Truck className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <div className="font-semibold text-xs">Cash on Delivery</div>
                      <div className={`text-[11px] mt-0.5 ${selectedMethod === 'cod' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Pay cash upon delivery
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Specific Payment Method Detail Panels */}
              {selectedMethod === 'upi_qr' && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Simulated Dynamic UPI QR SVG */}
                    <div className="p-2 bg-white rounded-lg border border-neutral-200 shadow-xs shrink-0 flex flex-col items-center">
                      <svg
                        className="w-28 h-28"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="100" height="100" fill="white" />
                        {/* QR Corners */}
                        <rect x="5" y="5" width="25" height="25" fill="#18181b" rx="2" />
                        <rect x="9" y="9" width="17" height="17" fill="white" />
                        <rect x="13" y="13" width="9" height="9" fill="#18181b" />

                        <rect x="70" y="5" width="25" height="25" fill="#18181b" rx="2" />
                        <rect x="74" y="9" width="17" height="17" fill="white" />
                        <rect x="78" y="13" width="9" height="9" fill="#18181b" />

                        <rect x="5" y="70" width="25" height="25" fill="#18181b" rx="2" />
                        <rect x="9" y="74" width="17" height="17" fill="white" />
                        <rect x="13" y="78" width="9" height="9" fill="#18181b" />

                        {/* QR data patterns */}
                        <rect x="36" y="10" width="8" height="8" fill="#18181b" />
                        <rect x="50" y="12" width="6" height="6" fill="#18181b" />
                        <rect x="36" y="24" width="6" height="12" fill="#18181b" />
                        <rect x="48" y="24" width="10" height="8" fill="#18181b" />

                        <rect x="10" y="38" width="12" height="6" fill="#18181b" />
                        <rect x="28" y="40" width="6" height="6" fill="#18181b" />
                        <rect x="42" y="38" width="16" height="16" fill="#d97706" rx="3" />
                        <text x="45" y="50" fill="white" fontSize="9" fontWeight="bold">₹</text>

                        <rect x="64" y="38" width="8" height="14" fill="#18181b" />
                        <rect x="80" y="42" width="10" height="6" fill="#18181b" />

                        <rect x="36" y="60" width="10" height="10" fill="#18181b" />
                        <rect x="52" y="62" width="6" height="6" fill="#18181b" />
                        <rect x="66" y="58" width="12" height="8" fill="#18181b" />
                        <rect x="40" y="76" width="18" height="6" fill="#18181b" />
                        <rect x="64" y="74" width="8" height="12" fill="#18181b" />
                        <rect x="78" y="78" width="12" height="12" fill="#18181b" />
                      </svg>
                      <span className="text-[10px] font-mono text-neutral-500 mt-1">
                        Amount: {formatCurrency(totals.total, currentStore.currencySymbol)}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1 text-xs">
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-neutral-200">
                        <span className="text-neutral-500">Merchant UPI ID:</span>
                        <div className="flex items-center gap-1.5 font-mono font-semibold text-neutral-900">
                          <span>{paymentCfg.upi_qr.upiId}</span>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="text-neutral-400 hover:text-neutral-700 p-0.5"
                            aria-label="Copy UPI ID"
                          >
                            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-neutral-500">
                        Open Google Pay, PhonePe or Paytm, scan the QR code above, and make payment of{' '}
                        <strong className="text-neutral-900">{formatCurrency(totals.total, currentStore.currencySymbol)}</strong>.
                      </p>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          UPI Ref / UTR / Transaction No. (Optional for Instant Demo)
                        </label>
                        <input
                          type="text"
                          value={upiRefInput}
                          onChange={(e) => setUpiRefInput(e.target.value)}
                          placeholder="e.g. 40392819034"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total Summary & Submit Action */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500">Total Payable:</span>
                <div className="text-xl font-bold text-neutral-900 font-mono tabular-nums">
                  {formatCurrency(totals.total, currentStore.currencySymbol)}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <span>
                  {selectedMethod === 'razorpay'
                    ? 'Pay with Razorpay'
                    : selectedMethod === 'cashfree'
                    ? 'Pay with Cashfree'
                    : selectedMethod === 'upi_qr'
                    ? 'Confirm UPI Payment'
                    : 'Place COD Order'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Realistic Simulated Razorpay Checkout Modal */}
        {isRazorpayModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-neutral-300">
              {/* Razorpay Brand Header */}
              <div className="bg-[#0c2340] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center font-bold text-white text-xs">
                    R
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">Razorpay Standard</div>
                    <div className="text-[10px] text-blue-200">{currentStore.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-white">
                    {formatCurrency(totals.total, currentStore.currencySymbol)}
                  </div>
                  <span className="text-[9px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                    TEST MODE
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Card Number (Pre-filled for Sandbox test)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded font-mono text-center"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-[11px] border border-blue-200">
                  <span>Merchant Key ID: </span>
                  <span className="font-mono font-semibold">{paymentCfg.razorpay.keyId}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRazorpayModalOpen(false)}
                    className="flex-1 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => simulateGatewayOrder('Razorpay')}
                    className="flex-1 py-2 text-xs font-semibold bg-[#0c2340] hover:bg-[#13335c] text-white rounded flex items-center justify-center gap-1 shadow-sm"
                  >
                    {isProcessing ? (
                      <span>Verifying...</span>
                    ) : (
                      <span>Pay {formatCurrency(totals.total, currentStore.currencySymbol)}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
