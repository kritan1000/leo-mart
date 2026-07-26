"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, ChevronRight, Star, Truck, ShieldCheck, Store } from "lucide-react";
import HomeHeader from "../../_components/HomeHeader";
import { useCart } from "@/lib/context/CartContext";

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { addToCart: addToCartContext } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = () => {
    addToCartContext(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedProducts: any[] = [];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-black font-sans">
      <HomeHeader />

      {/* Breadcrumb */}
      <div className="max-w-6xl w-full mx-auto px-6 md:px-12 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-purple-600 transition">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/groceries" className="hover:text-purple-600 transition">
            Groceries
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Product Detail */}
      <main className="max-w-6xl w-full mx-auto px-6 md:px-12 pb-16">
        <div className="bg-white border border-purple-100/60 rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-purple-50/30 aspect-square md:aspect-auto md:min-h-[500px] flex items-center justify-center border-b md:border-b-0 md:border-r border-purple-100/60 p-8">
              <span
                className={`absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm z-10 uppercase tracking-wider ${
                  product.stockStatus === "in-stock"
                    ? "bg-green-50 text-green-700"
                    : product.stockStatus === "bulk-deal"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {product.stockStatus === "in-stock"
                  ? "In Stock"
                  : product.stockStatus === "bulk-deal"
                  ? "Bulk Deal"
                  : "Low Stock"}
              </span>
              <img
                src={product.image}
                alt={product.name}
                className="object-contain max-h-full max-w-full rounded-xl"
              />
            </div>

            {/* Details */}
            <div className="p-8 md:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs text-purple-600 font-bold uppercase tracking-wider">
                  {product.brand}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {product.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.description}
                </p>

                {product.bulkPrice && (
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 space-y-1">
                    <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider block">
                      Wholesale Price
                    </span>
                    <span className="text-lg font-extrabold text-purple-700">
                      Rs. {product.bulkPrice.toLocaleString()}
                    </span>
                    {product.minBulkQty && (
                      <span className="text-xs text-gray-400 block">
                        Minimum {product.minBulkQty} units for bulk pricing
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                      Price
                    </span>
                    <span className="text-3xl font-extrabold text-purple-700">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center border border-purple-100 rounded-xl overflow-hidden h-10">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 text-gray-500 hover:bg-purple-50 active:bg-purple-100 transition text-lg"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-semibold text-gray-700 min-w-[30px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 text-gray-500 hover:bg-purple-50 active:bg-purple-100 transition text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={addToCart}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 ${
                    addedToCart
                      ? "bg-green-600 text-white shadow-green-500/20"
                      : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20 hover:shadow-lg"
                  }`}
                >
                  <ShoppingCart size={18} />
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </button>

                <button
                  onClick={() => {
                    addToCart();
                    router.push("/checkout");
                  }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm border-2 border-purple-200 text-purple-600 hover:bg-purple-50 active:scale-95 transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-purple-50">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Truck size={16} className="text-purple-600" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <ShieldCheck size={16} className="text-purple-600" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Quality Assured</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Store size={16} className="text-purple-600" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Bulk Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to catalog */}
        <div className="mt-8">
          <Link
            href="/groceries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>
        </div>
      </main>
    </div>
  );
}
