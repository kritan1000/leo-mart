"use client";

import React, { useState } from "react";
import { Building2, X, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { applyBusinessAccountAction } from "@/lib/actions/auth-action";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BusinessAccountModal({ isOpen, onClose }: Props) {
  const [businessName, setBusinessName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [businessType, setBusinessType] = useState("Restaurant / Hotel");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!businessName.trim() || !registrationNo.trim()) {
      setMessage("Business Name and Registration / PAN / VAT No are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await applyBusinessAccountAction({
        businessName,
        registrationNo,
        businessType,
      });

      if (res.success) {
        setIsSuccess(true);
        setMessage("Your Business Account application has been submitted successfully! Our B2B team will contact you shortly.");
      } else {
        setMessage(res.message || "Failed to submit business account application.");
      }
    } catch (err: any) {
      setMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-purple-100/80 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-purple-500/10 relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">Open Business Account</h2>
            <p className="text-[10px] text-gray-400">Unlock wholesale pricing & tax invoicing for B2B</p>
          </div>
        </div>

        {message && (
          <div className={`p-3.5 rounded-2xl text-xs font-semibold text-center border ${
            isSuccess ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"
          }`}>
            {message}
          </div>
        )}

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Everest View Hotel & Restaurant"
                className="w-full border border-purple-100 bg-purple-50/10 px-4 py-2.5 rounded-xl outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">PAN / VAT / Reg Number</label>
              <input
                type="text"
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                placeholder="e.g. 601234567"
                className="w-full border border-purple-100 bg-purple-50/10 px-4 py-2.5 rounded-xl outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Business Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full border border-purple-100 bg-purple-50/10 px-4 py-2.5 rounded-xl outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              >
                <option value="Restaurant / Hotel">Restaurant / Hotel / Cafe</option>
                <option value="Trekking Agency">Trekking & Expedition Office</option>
                <option value="Retail Grocery Store">Retail Grocery Store</option>
                <option value="Catering Service">Catering & Events Service</option>
                <option value="Corporate Office">Corporate Office</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-2xl text-xs shadow-lg shadow-purple-500/10 active:scale-95 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Business Account Application</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full border border-purple-100 text-purple-600 hover:bg-purple-50 font-bold py-3 rounded-2xl text-xs transition"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
