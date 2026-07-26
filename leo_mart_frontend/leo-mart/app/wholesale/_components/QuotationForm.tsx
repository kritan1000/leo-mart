"use client";

import React, { useState } from "react";
import { Building, Mail, Phone, MessageSquare, Send } from "lucide-react";
import { submitQuotationAction } from "@/lib/actions/quotation-action";

export default function QuotationForm() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!companyName.trim() || !email.trim() || !phone.trim() || !items.trim()) {
      setErrorMsg("All inquiry fields are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitQuotationAction({ companyName, email, phone, items });

      if (res.success) {
        setSuccessMsg("Your quotation request has been sent successfully!");
        setCompanyName("");
        setEmail("");
        setPhone("");
        setItems("");
      } else {
        setErrorMsg(res.message || "Failed to submit quotation request");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-purple-100 rounded-3xl p-6 shadow-xl shadow-purple-500/5 h-fit space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Request Quotation</h2>
        <p className="text-xs text-gray-400">Submit your sourcing list for customized discounts.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-2 rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-2 rounded-lg text-center font-medium">
            {successMsg}
          </div>
        )}

        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Company Name</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
              <Building size={14} />
            </span>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Alpine Treks Ltd."
              className="w-full border border-purple-100 pl-10 pr-4 py-2 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
              <Mail size={14} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="procurement@company.com"
              className="w-full border border-purple-100 pl-10 pr-4 py-2 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone / WhatsApp</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
              <Phone size={14} />
            </span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+977-98XXXXXXXX"
              className="w-full border border-purple-100 pl-10 pr-4 py-2 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Required Items & Quantity</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-purple-400">
              <MessageSquare size={14} />
            </span>
            <textarea
              value={items}
              onChange={(e) => setItems(e.target.value)}
              rows={4}
              placeholder="e.g. 50 bags of Jasmine Rice, 10 cartons of Sunflower oil..."
              className="w-full border border-purple-100 pl-10 pr-4 py-2 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md shadow-purple-500/10 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <Send size={12} />
          {isSubmitting ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
}
