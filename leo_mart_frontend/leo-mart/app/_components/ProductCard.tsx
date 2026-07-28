"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white dark:bg-[#1a1a24] border border-purple-100/50 dark:border-purple-900/30 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 transition duration-300 flex flex-col justify-between relative overflow-hidden">
      {product.stockStatus === "bulk-deal" && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm z-10 uppercase tracking-wider">
          Bulk Deal
        </span>
      )}
      {product.stockStatus === "low-stock" && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm z-10 uppercase tracking-wider">
          Low Stock
        </span>
      )}

      <div className="space-y-4">
        <Link href={`/groceries/${product._id}`} className="block">
          <div className="w-full aspect-square bg-gray-50 dark:bg-[#14141c] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex items-center justify-center relative">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
            />
          </div>
        </Link>

        <div className="space-y-1">
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block">
            {product.brand} • {product.category}
          </span>
          <Link href={`/groceries/${product._id}`}>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 min-h-[32px]">
            {product.description}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 block font-medium">
            Price
          </span>
          <span className="text-base font-extrabold text-purple-600 dark:text-purple-400">
            Rs. {product.price.toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 p-2 rounded-xl active:scale-95 transition-all hover:shadow-md hover:shadow-purple-500/10"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  );
}
