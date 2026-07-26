"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, Truck, CheckCircle2, XCircle, Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { updateOrderStatusAction } from "@/lib/actions/order-action";

interface Order {
  _id: string;
  customerInfo: { fullname: string; email: string; phone: string };
  shippingAddress: { street: string; city: string; district: string };
  items: Array<{ name: string; price: number; quantity: number; image: string }>;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  purchaseOrderId: string;
  createdAt: string;
}

interface OrderTableProps {
  orders: Order[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  currentStatus: string;
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  Pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  Processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
  Shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
  Delivered: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  Cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
};

const nextStatusMap: Record<string, string> = {
  Pending: "Processing",
  Processing: "Shipped",
  Shipped: "Delivered",
};

export default function OrderTable({
  orders,
  total,
  totalPages,
  currentPage,
  pageSize,
  currentStatus,
}: OrderTableProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch {
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    await handleStatusUpdate(orderId, "Cancelled");
  };

  const buildPageUrl = (page: number, status?: string) => {
    const params = new URLSearchParams();
    params.set("tab", "orders");
    params.set("page", String(page));
    params.set("size", String(pageSize));
    if (status) params.set("orderStatus", status);
    return `/admin/dashboard?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter:</span>
        {["", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
          <a
            key={s}
            href={buildPageUrl(1, s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentStatus === s
                ? "bg-purple-600 text-white"
                : "bg-white border border-purple-100 text-gray-600 hover:bg-purple-50"
            }`}
          >
            {s || "All"}
          </a>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-purple-100/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-purple-50/50 border-b border-purple-100/60">
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const cfg = statusConfig[order.orderStatus] || statusConfig.Pending;
                  const StatusIcon = cfg.icon;
                  const nextStatus = nextStatusMap[order.orderStatus];
                  const isExpanded = expandedId === order._id;

                  return (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-purple-50/20 transition">
                        <td className="px-4 py-3">
                          <span className="font-mono text-[10px] text-gray-500 block">{order.purchaseOrderId}</span>
                          <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-800 block">{order.customerInfo.fullname}</span>
                          <span className="text-[10px] text-gray-400">{order.customerInfo.phone}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-600">{order.items.length} item(s)</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-purple-700">Rs. {order.totalAmount.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}>
                            {order.paymentMethod} ({order.paymentStatus})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon size={10} />
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : order._id)}
                              className="p-1.5 hover:bg-purple-50 rounded-lg text-gray-400 hover:text-purple-600 transition"
                              title="View details"
                            >
                              <Eye size={14} />
                            </button>
                            {nextStatus && (
                              <button
                                onClick={() => handleStatusUpdate(order._id, nextStatus)}
                                disabled={updatingId === order._id}
                                className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold transition disabled:opacity-50"
                              >
                                {updatingId === order._id ? (
                                  <Loader2 className="animate-spin" size={10} />
                                ) : (
                                  `Mark ${nextStatus}`
                                )}
                              </button>
                            )}
                            {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                              <button
                                onClick={() => handleCancel(order._id)}
                                disabled={updatingId === order._id}
                                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold transition disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-4 py-4 bg-purple-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-2">
                                <h4 className="font-bold text-gray-700">Shipping Address</h4>
                                <p className="text-gray-600">
                                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.district}
                                </p>
                                <h4 className="font-bold text-gray-700 pt-2">Contact</h4>
                                <p className="text-gray-600">{order.customerInfo.email}</p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-bold text-gray-700">Items</h4>
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-purple-50 overflow-hidden shrink-0">
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                                    <span className="ml-auto font-semibold text-purple-700">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Page {currentPage} of {totalPages} ({total} orders)</span>
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <a
                href={buildPageUrl(currentPage - 1, currentStatus)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-purple-100 rounded-lg hover:bg-purple-50 transition"
              >
                <ChevronLeft size={14} /> Prev
              </a>
            )}
            {currentPage < totalPages && (
              <a
                href={buildPageUrl(currentPage + 1, currentStatus)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-purple-100 rounded-lg hover:bg-purple-50 transition"
              >
                Next <ChevronRight size={14} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
