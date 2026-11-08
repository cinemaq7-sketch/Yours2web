import React from 'react';
import { useStore } from '../../context/StoreContext';
import { calculateStoreMetrics, formatCurrency } from '../../utils/storeLogic';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Package,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { currentStore, setAdminTab, updateOrderStatus } = useStore();
  const metrics = calculateStoreMetrics(currentStore.orders);
  const recentOrders = currentStore.orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Gross Sales</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {formatCurrency(metrics.totalRevenue, currentStore.currencySymbol)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% from last week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Total Orders</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {metrics.totalOrders}
          </div>
          <div className="text-[11px] text-neutral-500">
            {metrics.pendingCount} need fulfillment packing
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Average Order Value</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {formatCurrency(metrics.averageOrderValue, currentStore.currencySymbol)}
          </div>
          <div className="text-[11px] text-neutral-500">
            Based on completed checkout purchases
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Store Visitors</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {currentStore.analytics.visits.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500">
            {currentStore.analytics.views.toLocaleString()} catalog pageviews
          </div>
        </div>
      </div>

      {/* Payout & Money Received Highlight Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-neutral-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <span>Merchant Payouts & Settlement</span>
            <span aria-hidden="true">·</span>
            <span>Bank Transfer Status</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {formatCurrency(currentStore.payoutSettings.pendingSettlement, currentStore.currencySymbol)} Pending Settlement
          </h3>
          <p className="text-xs text-neutral-300 max-w-xl">
            Linked to <strong className="text-white">{currentStore.payoutSettings.bankAccount.bankName}</strong> ({currentStore.payoutSettings.bankAccount.accountNumber.slice(-4).padStart(12, '*')}). Automatic transfer scheduled within T+2 working days.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setAdminTab('payments')}
            className="px-4 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>Manage Gateway & Bank Payouts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base text-neutral-900">Recent Customer Orders</h3>
            <p className="text-xs text-neutral-500">Incoming orders across all payment gateways</p>
          </div>
          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All ({currentStore.orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            <ShoppingBag className="w-8 h-8 mx-auto text-neutral-400 mb-2 stroke-1" />
            <p className="font-medium text-neutral-700">No orders yet</p>
            <p className="mt-1">When a customer places an order on your storefront, it will appear here instantly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200/60 text-neutral-600 font-medium">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900">{order.customer.name}</div>
                      <div className="text-[11px] text-neutral-500">{order.customer.city}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900">
                      {formatCurrency(order.total, currentStore.currencySymbol)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[10px] font-semibold tracking-wider text-neutral-700">
                        {order.paymentMethod.replace('_', ' ')}
                      </span>
                      <span className={`block text-[10px] font-medium ${
                        order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                          order.fulfillmentStatus === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800'
                            : order.fulfillmentStatus === 'shipped'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {order.fulfillmentStatus === 'unfulfilled' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded shadow-xs"
                        >
                          Confirm & Pack
                        </button>
                      )}
                      {order.fulfillmentStatus === 'confirmed' && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, 'shipped', {
                              courierName: 'Delhivery',
                              trackingNumber: `EXP-${Math.floor(100000 + Math.random() * 900000)}`,
                            })
                          }
                          className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded shadow-xs"
                        >
                          Ship Parcel
                        </button>
                      )}
                      {order.fulfillmentStatus === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded shadow-xs"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.fulfillmentStatus === 'delivered' && (
                        <span className="text-[11px] text-neutral-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
