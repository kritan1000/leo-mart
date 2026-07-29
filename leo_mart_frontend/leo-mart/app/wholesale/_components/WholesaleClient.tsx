"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Download, Sparkles, Building2 } from "lucide-react";
import { LeoMartLogo } from "../../(auth)/_components/type/AuthComponent";
import { useCart } from "@/lib/context/CartContext";
import QuotationForm from "./QuotationForm";
import BusinessAccountModal from "./BusinessAccountModal";

interface Props {
  products: any[];
}

export default function WholesaleClient({ products }: Props) {
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const { setIsCartOpen } = useCart();

  const handleDownloadCatalog = () => {
    const catalogHeader = "LEO MART WHOLESALE GROCERY CATALOG\n==================================\nAll prices in Nepalese Rupees (Rs.)\n\n";
    const catalogItems = products
      .map(
        (p, idx) =>
          `${idx + 1}. ${p.name} (${p.brand || "General"})\n   Retail Price: Rs. ${p.price}\n   Bulk Price: Rs. ${p.bulkPrice || p.price} / unit (Min Qty: ${p.minBulkQty || 1})\n   Stock Status: ${p.stockStatus || "In Stock"}\n`
      )
      .join("\n");

    const blob = new Blob([catalogHeader + catalogItems], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "LeoMart_Wholesale_Catalog.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById("bulk-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-black font-sans flex flex-col">
      {/* Business Account Registration Modal */}
      <BusinessAccountModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
      />

      {/* Header */}
      <header className="bg-white border-b border-purple-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-12">
          <Link href="/">
            <LeoMartLogo size={28} />
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link href="/groceries" className="hover:text-purple-600 transition">
              Groceries
            </Link>
            <Link href="/wholesale" className="text-purple-600 font-semibold">
              Bulk Orders
            </Link>
            <button
              onClick={() => setIsBusinessModalOpen(true)}
              className="hover:text-purple-600 transition cursor-pointer text-left font-semibold"
            >
              Business Services
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsCartOpen(true)} className="text-gray-600 hover:text-purple-600 transition relative cursor-pointer">
            <ShoppingCart size={22} />
          </button>
          <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition">
            <User size={22} />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 py-12 space-y-12">
        
        {/* Wholesale Hero Card */}
        <section className="bg-white border border-purple-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-purple-500/5 flex flex-col lg:flex-row items-center gap-8 overflow-hidden relative">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles size={12} />
              Wholesale Exclusive
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Wholesale Grocery Solutions for Your Business.
            </h1>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
              Reliable supply chains for hotels, trekking offices, and restaurants. Access wholesale pricing, monthly subscriptions, and dedicated B2B support.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsBusinessModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-purple-500/10 active:scale-95 transition flex items-center gap-2 cursor-pointer"
              >
                <Building2 size={18} />
                <span>Open Business Account</span>
              </button>
              <button
                onClick={handleScrollToCatalog}
                className="border border-purple-100 hover:border-purple-300 text-purple-600 hover:bg-purple-50/20 font-semibold px-6 py-3 rounded-xl active:scale-95 transition cursor-pointer"
              >
                View Bulk Pricing
              </button>
            </div>
          </div>
          <div className="flex-1 w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border border-purple-100 shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1470&auto=format&fit=crop"
              alt="Warehouse logistics"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Catalog & Quotation Split */}
        <section id="bulk-catalog" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order in Bulk List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Order in Bulk</h2>
              <button
                onClick={handleDownloadCatalog}
                className="text-xs text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Download size={14} />
                Download Full Catalog
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.length > 0 ? (
                products.map((product: any) => (
                  <div 
                    key={product._id} 
                    className="bg-white border border-purple-100/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-200 flex gap-4 relative overflow-hidden"
                  >
                    <div className="w-20 h-20 bg-purple-50/10 rounded-xl overflow-hidden border border-purple-50 shrink-0 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-purple-600 font-bold uppercase tracking-wider">
                            {product.brand}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            product.stockStatus === "in-stock"
                              ? "bg-green-50 text-green-700"
                              : product.stockStatus === "bulk-deal"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-red-50 text-red-700"
                          }`}>
                            {product.stockStatus === "in-stock" ? "In Stock" : product.stockStatus === "bulk-deal" ? "Bulk Deal" : "Low Stock"}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-xs line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-gray-400">
                          Retail: Rs. {product.price.toLocaleString()}
                        </p>
                      </div>

                      {product.minBulkQty > 0 ? (
                        <div className="pt-2 border-t border-purple-50/50 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-gray-400 block font-medium">Bulk Price (Min {product.minBulkQty})</span>
                            <span className="text-xs font-extrabold text-purple-700">
                              Rs. {product.bulkPrice.toLocaleString()} / unit
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-purple-50/50">
                          <span className="text-[9px] text-gray-400 italic">Contact for custom pricing</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-400 border border-dashed border-purple-100 rounded-2xl bg-white">
                  No products available for wholesale catalog.
                </div>
              )}
            </div>
          </div>

          {/* Interactive Request Quotation Form */}
          <QuotationForm />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-50 py-8 px-6 md:px-12 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Leo Mart Wholesale. All prices in Nepalese Rupees (Rs.).</p>
      </footer>
    </div>
  );
}
