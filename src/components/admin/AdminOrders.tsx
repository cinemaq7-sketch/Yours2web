import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FulfillmentStatus, Order } from '../../types/store';
import { formatCurrency } from '../../utils/storeLogic';
import {
  ShoppingBag,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { currentStore, updateOrderStatus } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Ship Modal State
  const [shippingOrder, setShippingOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState('Delhivery');
  const [trackingNumber, setTrackingNumber] = useState('');

  const filteredOrders = currentStore.orders.filter((order) => {
    const matchesStatus =
      filterStatus === 'all' || order.fulfillmentStatus === filterStatus;
    const matchesSearch =
      !search.trim() ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const handleOpenShip = (order: Order) => {
    setShippingOrder(order);
    setCourierName('Delhivery');
    setTrackingNumber(`EXP-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmShip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingOrder) return;
    updateOrderStatus(shippingOrder.id, 'shipped', {
      courierName,
      trackingNumber,
    });
    setShippingOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Orders & Fulfillment Pipeline</h2>
          <p className="text-xs text-neutral-500">
            Track customer purchases from warehouse packing to final delivery
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, phone, #ORD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Status Segmented Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'unfulfilled', label: 'Unfulfilled' },
          { id: 'confirmed', label: 'Confirmed (Packing)' },
          { id: 'shipped', label: 'Shipped (In Transit)' },
          { id: 'delivered', label: 'Delivered' },
        ].map((tab) => {
          const count =
            tab.id === 'all'
              ? currentStore.orders.length
              : currentStore.orders.filter((o) => o.fulfillmentStatus === tab.id).length;
          const isSelected = filterStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500 space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-neutral-400 stroke-1" />
            <p className="font-semibold text-neutral-800 text-sm">No orders matching criteria</p>
            <p>Customer checkout orders will appear in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200/60 text-neutral-600 font-medium">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Purchased Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="font-bold text-neutral-900 hover:text-amber-800 hover:underline flex items-center gap-1"
                      >
                        <span>#{order.orderNumber}</span>
                      </button>
                      <div className="text-[10px] text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900">{order.customer.name}</div>
                      <div className="text-[11px] text-neutral-500">{order.customer.city}, {order.customer.state}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{order.customer.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-700">
                      <div className="space-y-0.5">
                        {order.items.map((it) => (
                          <div key={it.productId} className="line-clamp-1 max-w-xs">
                            {it.title} <span className="text-neutral-400">×{it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 tabular-nums">
                      {formatCurrency(order.total, currentStore.currencySymbol)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[10px] font-semibold text-neutral-700 tracking-wider">
                        {order.paymentMethod.replace('_', ' ')}
                      </span>
                      <span
                        className={`block text-[10px] font-semibold ${
                          order.paymentStatus === 'paid'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                          order.fulfillmentStatus === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800'
                            : order.fulfillmentStatus === 'shipped'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                      {order.trackingNumber && (
                        <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                          {order.courierName}: {order.trackingNumber}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.fulfillmentStatus === 'unfulfilled' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded shadow-xs"
                          >
                            Pack & Confirm
                          </button>
                        )}
                        {order.fulfillmentStatus === 'confirmed' && (
                          <button
                            onClick={() => handleOpenShip(order)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded shadow-xs flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Ship</span>
                          </button>
                        )}
                        {order.fulfillmentStatus === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-xs"
                          >
                            Mark Delivered
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100"
                          title="View Invoice & Details"
                          aria-label={`View details for order ${order.orderNumber}`}
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ship Parcel Modal */}
      {shippingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-4 border border-neutral-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-sm text-neutral-900">
                Dispatch Order #{shippingOrder.orderNumber}
              </h3>
              <button
                onClick={() => setShippingOrder(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmShip} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="Delhivery">Delhivery Logistics</option>
                  <option value="BlueDart Express">BlueDart Express</option>
                  <option value="DTDC India">DTDC India</option>
                  <option value="Shiprocket">Shiprocket Express</option>
                  <option value="India Post EMS">India Post EMS Speedpost</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Airway Bill / Tracking Number (AWB)
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShippingOrder(null)}
                  className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirm Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice & Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Tax Invoice & Packing Slip
                </span>
                <h3 className="text-xl font-bold text-neutral-900 font-mono">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant and Customer Info */}
            <div className="grid grid-cols-2 gap-4 text-xs border-b pb-4">
              <div>
                <span className="text-neutral-400 font-medium">Merchant:</span>
                <div className="font-bold text-neutral-900 text-sm mt-0.5">{currentStore.name}</div>
                <div className="text-neutral-500 font-mono">{currentStore.subdomain}.shopflow.app</div>
                <div className="text-neutral-500">{currentStore.ownerEmail}</div>
              </div>
              <div>
                <span className="text-neutral-400 font-medium">Customer:</span>
                <div className="font-bold text-neutral-900 text-sm mt-0.5">{selectedOrder.customer.name}</div>
                <div className="text-neutral-600">
                  {selectedOrder.customer.address}, {selectedOrder.customer.city}
                </div>
                <div className="text-neutral-600 font-mono">
                  PIN: {selectedOrder.customer.pincode} · {selectedOrder.customer.phone}
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-neutral-900">Line Items</h4>
              <div className="divide-y divide-neutral-100 text-xs">
                {selectedOrder.items.map((it) => (
                  <div key={it.productId} className="py-2 flex justify-between">
                    <div>
                      <div className="font-medium text-neutral-900">{it.title}</div>
                      <div className="text-neutral-400 text-[11px]">
                        {formatCurrency(it.price, currentStore.currencySymbol)} × {it.quantity}
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-neutral-900 tabular-nums">
                      {formatCurrency(it.price * it.quantity, currentStore.currencySymbol)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-neutral-200 space-y-1 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatCurrency(selectedOrder.subtotal, currentStore.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping:</span>
                  <span className="font-mono">{formatCurrency(selectedOrder.shipping, currentStore.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Tax (5% GST):</span>
                  <span className="font-mono">{formatCurrency(selectedOrder.tax, currentStore.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1 border-t">
                  <span>Total:</span>
                  <span className="font-mono text-base">{formatCurrency(selectedOrder.total, currentStore.currencySymbol)}</span>
                </div>
              </div>
            </div>

            {/* Tracking History */}
            <div className="bg-neutral-50 p-4 rounded-xl space-y-2 border border-neutral-200/80">
              <span className="text-[11px] font-semibold text-neutral-700">Audit & Tracking Timeline</span>
              <div className="space-y-2 text-xs">
                {selectedOrder.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-neutral-800">{step.status}</span>
                      <span className="text-neutral-400 ml-2 font-mono text-[10px]">{step.time}</span>
                      <p className="text-[11px] text-neutral-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
