"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertCircle, ShoppingBag, ShieldCheck } from "lucide-react";
import { verifyKhaltiAction } from "@/lib/actions/payment-action";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkAuth } = useAuth();
  const { clearCart } = useCart();

  const pidx = searchParams.get("pidx");
  const [verifying, setVerifying] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!pidx) {
      setErrorMsg("No payment reference (pidx) found in URL.");
      setVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyKhaltiAction(pidx);
        if (res.success && res.order) {
          setOrder(res.order);
          clearCart();
          // Refresh user data to update loyalty points
          checkAuth();
        } else {
          // If verification fails, redirect to payment-failed page with message
          const reason = encodeURIComponent(res.message || "Payment verification failed");
          router.push(`/payment-failed?reason=${reason}`);
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        const reason = encodeURIComponent(err.message || "Failed to verify transaction");
        router.push(`/payment-failed?reason=${reason}`);
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [pidx, router]);

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <Loader2 className="animate-spin text-purple-600" size={40} />
        <h2 className="text-base font-bold text-gray-800">Verifying Khalti ePayment v2...</h2>
        <p className="text-xs text-gray-400">Please do not refresh or close this window.</p>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="space-y-4 py-8">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Payment Verification Failed</h2>
        <p className="text-xs text-red-500">{errorMsg || "Unable to retrieve order details"}</p>
        <div className="pt-4 flex gap-3">
          <Link
            href="/checkout"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
          >
            Return to Checkout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 size={36} />
      </div>

      <div className="space-y-1">
        <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Khalti ePayment v2 Verified
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight pt-2">
          Payment Successful!
        </h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Your payment has been verified with Khalti and your order has been placed in MongoDB.
        </p>
      </div>

      {/* Verified Order Summary */}
      <div className="bg-[#FAFAFC] border border-purple-100/60 rounded-2xl p-5 text-left space-y-3 text-xs">
        <div className="flex justify-between border-b border-purple-50 pb-2">
          <span className="text-gray-400 font-medium">Transaction ID (pidx)</span>
          <span className="font-bold text-purple-700 font-mono">{order.pidx || pidx}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Purchase Order ID</span>
          <span className="font-bold text-gray-800">{order.purchaseOrderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Payment Method</span>
          <span className="font-bold text-purple-600">Khalti Payment</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Payment Status</span>
          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">
            {order.paymentStatus}
          </span>
        </div>
        <div className="flex justify-between border-t border-purple-50 pt-2 text-sm font-extrabold">
          <span>Amount Paid</span>
          <span className="text-purple-700">Rs. {order.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <Link
          href="/groceries"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-purple-500/10 transition active:scale-95 text-center"
        >
          Return to Shop
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 border border-purple-100 hover:border-purple-300 text-purple-600 hover:bg-purple-50/20 font-bold py-3 rounded-xl text-xs transition active:scale-95 text-center"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-black font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-purple-100/80 rounded-3xl p-8 shadow-xl shadow-purple-500/5 text-center space-y-6">
        <div className="flex justify-center">
          <LeoMartLogo size={32} />
        </div>
        <Suspense fallback={<Loader2 className="animate-spin text-purple-600 mx-auto" size={32} />}>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
