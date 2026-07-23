import React from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, Truck, MapPin } from "lucide-react";
import { fetchOrderByIdAction } from "@/lib/actions/order-action";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { orderId } = await searchParams;

  let order: any = null;
  if (orderId) {
    const res = await fetchOrderByIdAction(orderId);
    if (res.success) {
      order = res.order;
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-black font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-purple-100/80 rounded-3xl p-8 shadow-xl shadow-purple-500/5 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center">
          <LeoMartLogo size={32} />
        </div>

        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Order Placed Successfully!</h1>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Thank you for shopping with Leo Mart. Your Cash on Delivery order has been registered and is being prepared.
          </p>
        </div>

        {order && (
          <div className="bg-[#FAFAFC] border border-purple-100/60 rounded-2xl p-4 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-purple-50 pb-2">
              <span className="text-gray-400 font-medium">Order Reference</span>
              <span className="font-bold text-purple-700">{order.purchaseOrderId || order._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Payment Method</span>
              <span className="font-bold text-gray-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Payment Status</span>
              <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between border-t border-purple-50 pt-2 text-sm font-extrabold">
              <span>Total Amount</span>
              <span className="text-purple-700">Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/groceries"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-purple-500/10 transition active:scale-95 text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 border border-purple-100 hover:border-purple-300 text-purple-600 hover:bg-purple-50/20 font-bold py-3 rounded-xl text-xs transition active:scale-95 text-center"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
