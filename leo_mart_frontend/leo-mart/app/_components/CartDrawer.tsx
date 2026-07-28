"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateCartQty,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const checkout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 transition duration-300 flex justify-end">
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-[#1a1a24] h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300 text-gray-900 dark:text-gray-100 border-l border-gray-100 dark:border-gray-800">
        <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-purple-50 dark:border-purple-950/50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-950/50 rounded-xl">
                <ShoppingCart className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Your Cart
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-4 bg-gray-50 dark:bg-[#14141c] border border-gray-100 dark:border-gray-800 rounded-2xl p-3 hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                      {item.product.brand}
                    </span>
                    <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 block mt-1">
                      Rs. {item.product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden h-7 bg-white dark:bg-gray-800 scale-90">
                      <button
                        onClick={() => updateCartQty(item.product._id, -1)}
                        className="px-1.5 text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition"
                      >
                        -
                      </button>
                      <span className="px-1.5 text-[10px] font-bold text-gray-700 dark:text-gray-300 min-w-[15px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.product._id, 1)}
                        className="px-1.5 text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-full">
                  <ShoppingBag className="text-purple-300 dark:text-purple-600" size={40} />
                </div>
                <span className="text-sm font-semibold text-gray-400">
                  Your cart is empty
                </span>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Add fresh groceries to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                Grand Total
              </span>
              <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                Rs. {cartTotal.toLocaleString()}
              </span>
            </div>
            <button
              onClick={checkout}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl text-sm shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
