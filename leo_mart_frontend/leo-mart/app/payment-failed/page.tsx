"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || searchParams.get("status") || "Payment was cancelled or failed verification.";

  return (
    <div className="space-y-6 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <AlertTriangle size={36} />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Payment Failed</h1>
        <p className="text-xs text-red-500 max-w-sm mx-auto font-medium">
          {decodeURIComponent(reason)}
        </p>
        <p className="text-xs text-gray-400 max-w-sm mx-auto pt-1">
          No order was created or charged. You can retry the payment or select another payment method.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row gap-3">
        <Link
          href="/checkout"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-purple-500/10 transition active:scale-95 text-center flex items-center justify-center gap-1.5"
        >
          <RefreshCw size={14} />
          Retry Payment
        </Link>
        <Link
          href="/groceries"
          className="flex-1 border border-purple-100 hover:border-purple-300 text-purple-600 hover:bg-purple-50/20 font-bold py-3 rounded-xl text-xs transition active:scale-95 text-center flex items-center justify-center gap-1.5"
        >
          <ArrowLeft size={14} />
          Return to Store
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-black font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-purple-100/80 rounded-3xl p-8 shadow-xl shadow-purple-500/5 text-center space-y-6">
        <div className="flex justify-center">
          <LeoMartLogo size={32} />
        </div>
        <Suspense fallback={<div className="text-xs text-gray-400">Loading...</div>}>
          <PaymentFailedContent />
        </Suspense>
      </div>
    </div>
  );
}
