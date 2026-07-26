"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export default function CartDrawer() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQty, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart();

  const checkout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition duration-300 flex justify-end">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300 text-black">
        <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-purple-50 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-purple-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Your Shopping Cart</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:bg-purple-50 rounded-lg text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-4 bg-[#FAFAFC] border border-purple-100/50 rounded-xl p-3 shadow-inner"
                >
                  <div className="w-14 h-14 bg-white border border-purple-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-gray-400 block">{item.product.brand}</span>
                    <span className="text-xs font-extrabold text-purple-700 block mt-1">
                      Rs. {item.product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center border border-purple-100 rounded-lg overflow-hidden h-7 bg-white scale-90">
                      <button
                        onClick={() => updateCartQty(item.product._id, -1)}
                        className="px-1.5 text-gray-500 hover:bg-purple-50 transition"
                      >
                        -
                      </button>
                      <span className="px-1.5 text-[10px] font-bold text-gray-700 min-w-[15px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.product._id, 1)}
                        className="px-1.5 text-gray-500 hover:bg-purple-50 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <ShoppingBag className="text-purple-200" size={48} />
                <span className="text-sm font-semibold text-gray-400">Your cart is empty</span>
                <p className="text-xs text-gray-400">Add fresh groceries from the list to get started.</p>
              </div>
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="border-t border-purple-50 pt-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Grand Total</span>
              <span className="text-xl font-extrabold text-purple-700">
                Rs. {cartTotal.toLocaleString()}
              </span>
            </div>
            <button
              onClick={checkout}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl text-sm shadow-md shadow-purple-500/10 active:scale-95 transition flex items-center justify-center gap-1.5"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
