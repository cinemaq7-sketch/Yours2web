import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/storeLogic';
import {
  CreditCard,
  Building2,
  QrCode,
  Truck,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  ArrowDownToLine,
  RefreshCw,
  HelpCircle,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const {
    currentStore,
    updatePaymentConfig,
    updatePayoutSettings,
    triggerManualPayout,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'gateways' | 'payouts'>('gateways');
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Razorpay state
  const [rzpEnabled, setRzpEnabled] = useState(currentStore.paymentConfig.razorpay.enabled);
  const [rzpKeyId, setRzpKeyId] = useState(currentStore.paymentConfig.razorpay.keyId);
  const [rzpKeySecret, setRzpKeySecret] = useState(currentStore.paymentConfig.razorpay.keySecret);
  const [rzpTestMode, setRzpTestMode] = useState(currentStore.paymentConfig.razorpay.testMode);

  // Cashfree state
  const [cfEnabled, setCfEnabled] = useState(currentStore.paymentConfig.cashfree.enabled);
  const [cfAppId, setCfAppId] = useState(currentStore.paymentConfig.cashfree.appId);
  const [cfSecretKey, setCfSecretKey] = useState(currentStore.paymentConfig.cashfree.secretKey);
  const [cfEnv, setCfEnv] = useState(currentStore.paymentConfig.cashfree.environment);

  // Direct UPI state
  const [upiEnabled, setUpiEnabled] = useState(currentStore.paymentConfig.upi_qr.enabled);
  const [upiId, setUpiId] = useState(currentStore.paymentConfig.upi_qr.upiId);
  const [upiMerchantName, setUpiMerchantName] = useState(currentStore.paymentConfig.upi_qr.merchantName);

  // COD state
  const [codEnabled, setCodEnabled] = useState(currentStore.paymentConfig.cod.enabled);
  const [codFee, setCodFee] = useState(currentStore.paymentConfig.cod.codFee.toString());

  // Bank Account state
  const [accountHolder, setAccountHolder] = useState(currentStore.payoutSettings.bankAccount.accountHolder);
  const [bankName, setBankName] = useState(currentStore.payoutSettings.bankAccount.bankName);
  const [accountNumber, setAccountNumber] = useState(currentStore.payoutSettings.bankAccount.accountNumber);
  const [ifscCode, setIfscCode] = useState(currentStore.payoutSettings.bankAccount.ifscCode);

  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentConfig({
      razorpay: {
        ...currentStore.paymentConfig.razorpay,
        enabled: rzpEnabled,
        keyId: rzpKeyId,
        keySecret: rzpKeySecret,
        testMode: rzpTestMode,
      },
      cashfree: {
        ...currentStore.paymentConfig.cashfree,
        enabled: cfEnabled,
        appId: cfAppId,
        secretKey: cfSecretKey,
        environment: cfEnv,
      },
      upi_qr: {
        ...currentStore.paymentConfig.upi_qr,
        enabled: upiEnabled,
        upiId,
        merchantName: upiMerchantName,
      },
      cod: {
        ...currentStore.paymentConfig.cod,
        enabled: codEnabled,
        codFee: parseFloat(codFee) || 0,
      },
    });

    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    updatePayoutSettings({
      bankAccount: {
        accountHolder,
        bankName,
        accountNumber,
        ifscCode,
      },
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation between Gateways & Payouts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Payment Gateways & Merchant Settlements
          </h2>
          <p className="text-xs text-neutral-500">
            Configure how you accept money from customers and receive direct payouts to your bank account
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('gateways')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'gateways'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Online Gateways</span>
          </button>
          <button
            onClick={() => setActiveSubTab('payouts')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'payouts'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bank Payouts & Money Received</span>
          </button>
        </div>
      </div>

      {saveFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Payment configuration saved successfully! Active on storefront checkout.</span>
        </div>
      )}

      {activeSubTab === 'gateways' ? (
        /* Gateways Setup Form */
        <form onSubmit={handleSaveGateways} className="space-y-6">
          {/* Guide Callout explaining online payment setup */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>How To Accept Online Payments For Your Store:</span>
            </div>
            <p className="leading-relaxed text-amber-900/90">
              You have 3 powerful ways to accept money from buyers:
            </p>
            <ul className="list-disc list-inside space-y-1 text-amber-900/80 pl-1">
              <li>
                <strong>Direct UPI QR (Easiest & Free):</strong> Enter your personal or business UPI ID (e.g. <span className="font-mono">yourname@okhdfcbank</span>). Buyers scan with Google Pay, PhonePe, or Paytm and the money goes directly into your bank account with 0% platform commissions!
              </li>
              <li>
                <strong>Razorpay Payment Gateway:</strong> Supports Credit/Debit Cards, Netbanking from 50+ banks, EMI, and Wallets. Sign up at razorpay.com, grab your Key ID, and paste it below.
              </li>
              <li>
                <strong>Cashfree Payments:</strong> High-success payment gateway with instant refunds and UPI intent.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Razorpay Gateway Card */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    R
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-sm">Razorpay Payment Gateway</h3>
                    <p className="text-[11px] text-neutral-500">Cards, UPI, Netbanking & Wallets</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rzpEnabled}
                    onChange={(e) => setRzpEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Razorpay Key ID *
                  </label>
                  <input
                    type="text"
                    value={rzpKeyId}
                    onChange={(e) => setRzpKeyId(e.target.value)}
                    placeholder="rzp_test_..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Razorpay Key Secret *
                  </label>
                  <input
                    type="password"
                    value={rzpKeySecret}
                    onChange={(e) => setRzpKeySecret(e.target.value)}
                    placeholder="sec_..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="font-semibold text-neutral-800">Sandbox / Test Mode</span>
                    <p className="text-[11px] text-neutral-500">Allows simulated test transactions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={rzpTestMode}
                    onChange={(e) => setRzpTestMode(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-neutral-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Direct UPI QR Card (0% Commission) */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-sm">Direct UPI QR (0% Fee)</h3>
                    <p className="text-[11px] text-neutral-500">Google Pay, PhonePe, Paytm Direct Credit</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={upiEnabled}
                    onChange={(e) => setUpiEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Your UPI ID (VPA) *
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourstore@okhdfcbank"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Payments made to this UPI ID are credited directly into your bank account.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Business Payee Name (Shown on UPI screen) *
                  </label>
                  <input
                    type="text"
                    value={upiMerchantName}
                    onChange={(e) => setUpiMerchantName(e.target.value)}
                    placeholder="e.g. Aura Handlooms LLP"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Cashfree Payments Card */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    CF
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-sm">Cashfree Payments</h3>
                    <p className="text-[11px] text-neutral-500">Payment Gateway & Pay Later</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cfEnabled}
                    onChange={(e) => setCfEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Cashfree App ID
                  </label>
                  <input
                    type="text"
                    value={cfAppId}
                    onChange={(e) => setCfAppId(e.target.value)}
                    placeholder="TEST_CF_..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Cashfree Secret Key
                  </label>
                  <input
                    type="password"
                    value={cfSecretKey}
                    onChange={(e) => setCfSecretKey(e.target.value)}
                    placeholder="cfsk_..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Cash on Delivery (COD) Card */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-sm">Cash on Delivery (COD)</h3>
                    <p className="text-[11px] text-neutral-500">Pay cash upon delivery at customer doorstep</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={codEnabled}
                    onChange={(e) => setCodEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
                </label>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    COD Handling Fee ({currentStore.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={codFee}
                    onChange={(e) => setCodFee(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Set to 0 for Free COD to maximize checkout conversions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              Save Gateway Configuration
            </button>
          </div>
        </form>
      ) : (
        /* Bank Account & Payouts Ledger */
        <div className="space-y-8">
          {/* Balance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-neutral-500 font-medium">Pending Settlement</span>
              <div className="text-3xl font-bold text-neutral-900 font-mono tabular-nums">
                {formatCurrency(currentStore.payoutSettings.pendingSettlement, currentStore.currencySymbol)}
              </div>
              <p className="text-[11px] text-neutral-500">
                Accumulated online orders awaiting scheduled bank deposit
              </p>
              {currentStore.payoutSettings.pendingSettlement > 0 && (
                <button
                  onClick={triggerManualPayout}
                  className="mt-2 w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Transfer Immediately to Bank</span>
                </button>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-neutral-500 font-medium">Total Lifetime Settled</span>
              <div className="text-3xl font-bold text-emerald-700 font-mono tabular-nums">
                {formatCurrency(currentStore.payoutSettings.totalSettled, currentStore.currencySymbol)}
              </div>
              <p className="text-[11px] text-neutral-500">
                Successfully deposited into verified merchant bank account
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2">
              <span className="text-xs text-neutral-500 font-medium">Settlement Schedule</span>
              <div className="text-xl font-bold text-neutral-900">
                T+{currentStore.payoutSettings.autoPayoutDays} Working Days
              </div>
              <p className="text-[11px] text-neutral-500">
                Direct NEFT / IMPS to {currentStore.payoutSettings.bankAccount.bankName}
              </p>
            </div>
          </div>

          {/* Bank Account Settings Form */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-4 shadow-2xs">
            <div className="border-b pb-3">
              <h3 className="font-semibold text-neutral-900 text-sm">
                Settlement Bank Account Details
              </h3>
              <p className="text-xs text-neutral-500">
                Funds collected via online checkout gateways will be transferred to this account
              </p>
            </div>

            <form onSubmit={handleSaveBank} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Account Beneficiary Name *
                </label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="e.g. Aura Handlooms LLP"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Bank Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="502000..."
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Bank IFSC Code *
                </label>
                <input
                  type="text"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="HDFC0000128"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono uppercase"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Update Settlement Bank Details
                </button>
              </div>
            </form>
          </div>

          {/* Payout History Ledger */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900 text-sm">Payout Settlement History</h3>
                <p className="text-xs text-neutral-500">Audited transfers to your bank account with UTR numbers</p>
              </div>
            </div>

            {currentStore.payoutSettings.payouts.length === 0 ? (
              <div className="p-12 text-center text-xs text-neutral-500">
                No bank transfers yet. As customer orders are confirmed, your settled balance will appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/70 border-b border-neutral-200/60 text-neutral-600 font-medium">
                    <tr>
                      <th className="py-3 px-4">Payout ID</th>
                      <th className="py-3 px-4">Settled Amount</th>
                      <th className="py-3 px-4">Beneficiary Bank</th>
                      <th className="py-3 px-4">Bank UTR Reference</th>
                      <th className="py-3 px-4">Deposit Date</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono">
                    {currentStore.payoutSettings.payouts.map((pay) => (
                      <tr key={pay.id} className="hover:bg-neutral-50/50">
                        <td className="py-3.5 px-4 font-bold text-neutral-900">
                          {pay.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm tabular-nums">
                          {formatCurrency(pay.amount, currentStore.currencySymbol)}
                        </td>
                        <td className="py-3.5 px-4 font-sans text-neutral-800">
                          {currentStore.payoutSettings.bankAccount.bankName} (***{currentStore.payoutSettings.bankAccount.accountNumber.slice(-4)})
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600">
                          {pay.utr}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 font-sans">
                          {pay.date}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 font-sans">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>SETTLED</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
