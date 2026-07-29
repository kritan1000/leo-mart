"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { LeoMartLogo } from "../../(auth)/_components/type/AuthComponent";
import { ShoppingCart, LogOut, Package, ChevronRight, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";

interface OrderItem {
  product: { _id: string; name: string; images?: string[] };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress?: { street: string; city: string; district: string };
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  Pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  Processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
  Delivered: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  Cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
  Shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
};

export default function OrdersPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { setIsCartOpen } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      window.location.href = "/login";
      return;
    }

    async function fetchOrders() {
      try {
        const { fetchUserOrdersAction } = await import("@/lib/actions/order-action");
        const result = await fetchUserOrdersAction();
        if (result.success) {
          setOrders(result.data);
        } else {
          setError(result.message || "Failed to load orders");
        }
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <div className="text-purple-600 text-sm font-semibold animate-pulse">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
      <header className="bg-white border-b border-purple-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-12">
          <Link href="/">
            <LeoMartLogo size={26} />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link href="/dashboard" className="hover:text-purple-600 transition">
              Dashboard
            </Link>
            <Link href="/groceries" className="hover:text-purple-600 transition">
              Groceries
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsCartOpen(true)} className="text-gray-600 hover:text-purple-600 transition cursor-pointer">
            <ShoppingCart size={22} />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-semibold transition cursor-pointer"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Track your purchases and loyalty rewards</p>
          </div>
          <Link
            href="/groceries"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-500/10 active:scale-95 transition text-sm"
          >
            Shop More
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div className="bg-white border border-purple-100 rounded-3xl p-12 shadow-xl shadow-purple-500/5 text-center space-y-4">
            <Package size={48} className="mx-auto text-purple-300" />
            <h2 className="text-lg font-bold text-gray-800">No orders yet</h2>
            <p className="text-sm text-gray-500">Your order history will appear here after your first purchase.</p>
            <Link
              href="/groceries"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-purple-500/10 active:scale-95 transition text-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const st = statusConfig[order.orderStatus] || statusConfig.Pending;
              const StatusIcon = st.icon;
              return (
                <div
                  key={order._id}
                  className="bg-white border border-purple-100/80 rounded-2xl p-5 shadow-xl shadow-purple-500/5 hover:shadow-purple-500/10 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">#{order.orderNumber || order._id.slice(-8).toUpperCase()}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${st.bg} ${st.color}`}>
                          <StatusIcon size={10} />
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        <span className="mx-1.5">·</span>
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        <span className="mx-1.5">·</span>
                        Rs. {order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                        {order.paymentMethod === "khalti" ? "Khalti" : "COD"}
                      </span>
                      <Link
                        href={`/payment-success?orderId=${order._id}`}
                        className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 transition"
                      >
                        View <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {order.shippingAddress && (
                    <p className="text-[11px] text-gray-400 mt-2 border-t border-purple-50/80 pt-2">
                      Delivering to: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.district}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
