"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, User, Grid, SlidersHorizontal, Check, X, Trash2, ShoppingBag } from "lucide-react";
import { LeoMartLogo } from "../../(auth)/_components/type/AuthComponent";

interface CatalogClientProps {
  initialProducts: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  initialSearch: string;
  initialCategory: string;
  initialBrand: string;
  initialMinPrice: string;
  initialMaxPrice: string;
}

interface CartItem {
  product: any;
  quantity: number;
}

export default function CatalogClient({
  initialProducts,
  total,
  totalPages,
  currentPage,
  pageSize,
  initialSearch,
  initialCategory,
  initialBrand,
  initialMinPrice,
  initialMaxPrice,
}: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search input state
  const [search, setSearch] = useState(initialSearch);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);

  // Cart drawer state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setSearch(initialSearch);
    setSelectedCategory(initialCategory);
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
    setSelectedBrand(initialBrand);
  }, [initialSearch, initialCategory, initialBrand, initialMinPrice, initialMaxPrice]);

  const updateFilters = (updates: {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    clearAll?: boolean;
  }) => {
    const params = new URLSearchParams();
    params.set("page", "1"); // reset to page 1 on filter
    params.set("size", pageSize.toString());

    if (updates.clearAll) {
      router.push("/groceries");
      return;
    }

    // Set search
    const searchVal = updates.search !== undefined ? updates.search : search;
    if (searchVal.trim()) params.set("search", searchVal.trim());

    // Set category
    const catVal = updates.category !== undefined ? updates.category : selectedCategory;
    if (catVal) params.set("category", catVal);

    // Set brand
    const brandVal = updates.brand !== undefined ? updates.brand : selectedBrand;
    if (brandVal) params.set("brand", brandVal);

    // Set prices
    const minVal = updates.minPrice !== undefined ? updates.minPrice : minPrice;
    if (minVal) params.set("minPrice", minVal);

    const maxVal = updates.maxPrice !== undefined ? updates.maxPrice : maxPrice;
    if (maxVal) params.set("maxPrice", maxVal);

    router.push(`/groceries?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const addToCart = (product: any) => {
    const qty = quantities[product._id] || 1;
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    // Reset quantity select
    setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
    setIsCartOpen(true);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product._id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Sync cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem("leo_mart_cart");
      if (saved && cart.length === 0) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("leo_mart_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const checkout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ["Rice & Grains", "Flour & Baking", "Lentils & Pulses", "Ready to Eat"];
  const brands = ["Royal Harvest", "Golden Grain", "Nature's Best", "Bulk Basics"];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-black font-sans flex flex-col relative overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between sticky top-0 z-40 shadow-sm shadow-purple-500/5 gap-4">
        <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-start">
          <Link href="/">
            <LeoMartLogo size={28} />
          </Link>
          <form onSubmit={handleSearchSubmit} className="flex-1 md:w-80 max-w-sm relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groceries..."
              className="w-full border border-purple-100/80 bg-purple-50/20 pl-4 pr-10 py-2 rounded-xl text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600">
              <Search size={18} />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-8 justify-between w-full md:w-auto">
          <nav className="flex items-center gap-6 text-sm font-semibold text-gray-600">
            <Link href="/groceries" className="text-purple-600 font-semibold">
              Categories
            </Link>
            <Link href="/groceries" className="hover:text-purple-600 transition">
              Groceries
            </Link>
            <Link href="/wholesale" className="hover:text-purple-600 transition">
              Bulk Orders
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-gray-600 hover:text-purple-600 transition relative p-1.5 hover:bg-purple-50 rounded-xl"
            >
              <ShoppingCart size={22} />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-purple-600 text-white text-[9px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white">
                  {totalCartCount}
                </span>
              )}
            </button>
            <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition">
              <User size={22} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main split content */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full md:w-60 shrink-0 space-y-6">
          {/* Category */}
          <div className="bg-white border border-purple-100/60 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Category</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat}
                    onChange={() => updateFilters({ category: selectedCategory === cat ? "" : cat })}
                    className="rounded border-purple-200 text-purple-600 focus:ring-purple-500/20"
                  />
                  <span className="text-xs text-gray-600 group-hover:text-purple-600 transition">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-white border border-purple-100/60 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Price Range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full border border-purple-100/60 px-3 py-1.5 rounded-lg text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <span className="text-gray-300 text-xs">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full border border-purple-100/60 px-3 py-1.5 rounded-lg text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <button
              onClick={() => updateFilters({ minPrice, maxPrice })}
              className="w-full bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-bold py-2 rounded-xl transition"
            >
              Apply
            </button>
          </div>

          {/* Brand */}
          <div className="bg-white border border-purple-100/60 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Brand</h3>
            <div className="space-y-2">
              {brands.map((br) => (
                <label key={br} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrand === br}
                    onChange={() => updateFilters({ brand: selectedBrand === br ? "" : br })}
                    className="rounded border-purple-200 text-purple-600 focus:ring-purple-500/20"
                  />
                  <span className="text-xs text-gray-600 group-hover:text-purple-600 transition">
                    {br}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Catalog Grid */}
        <section className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-gray-900">
                {initialSearch ? `Search Results for "${initialSearch}"` : "Groceries Catalog"}
              </h2>
              <span className="text-xs text-gray-400">Showing {initialProducts.length} items</span>
            </div>

            {/* Clear Filters Active tags */}
            {(selectedCategory || selectedBrand || initialSearch || minPrice || maxPrice) && (
              <button
                onClick={() => updateFilters({ clearAll: true })}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-bold transition"
              >
                Clear all <X size={12} />
              </button>
            )}
          </div>

          {/* Catalog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialProducts.length > 0 ? (
              initialProducts.map((product) => {
                const qty = quantities[product._id] || 1;
                return (
                  <div
                    key={product._id}
                    className="group bg-white border border-purple-100/50 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Stock label */}
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm z-10 uppercase tracking-wider ${
                        product.stockStatus === "in-stock"
                          ? "bg-green-50 text-green-700"
                          : product.stockStatus === "bulk-deal"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.stockStatus === "in-stock" ? "In Stock" : product.stockStatus === "bulk-deal" ? "Bulk Deal" : "Low Stock"}
                    </span>

                    <div className="space-y-4">
                      {/* Image container */}
                      <div className="w-full aspect-square bg-purple-50/10 rounded-xl overflow-hidden border border-purple-50 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                        />
                      </div>

                      {/* Meta data */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider block">
                          {product.brand}
                        </span>
                        <h3 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-purple-600 transition">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px]">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-purple-50 mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-extrabold text-purple-700">
                          Rs. {product.price.toLocaleString()}
                        </span>
                        {/* Qty controls */}
                        <div className="flex items-center border border-purple-100 rounded-lg overflow-hidden h-8">
                          <button
                            onClick={() => handleQuantityChange(product._id, -1)}
                            className="px-2 text-gray-500 hover:bg-purple-50 active:bg-purple-100 transition"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold text-gray-700 min-w-[20px] text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product._id, 1)}
                            className="px-2 text-gray-500 hover:bg-purple-50 active:bg-purple-100 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl text-xs shadow-md shadow-purple-500/10 active:scale-95 transition flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center text-gray-400 border border-dashed border-purple-100 rounded-3xl bg-white">
                No matching groceries found.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Cart Drawer Slide-out overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition duration-300 flex justify-end">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

          {/* Drawer content */}
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

              {/* Cart List */}
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
                        {/* Qty controls */}
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

            {/* Cart Footer */}
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
      )}
    </div>
  );
}
