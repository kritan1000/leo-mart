"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, User, Grid, SlidersHorizontal, Check, X } from "lucide-react";
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

  // Cart helper (local state indicator)
  const [cartCount, setCartCount] = useState(0);
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

  const categories = ["Rice & Grains", "Flour & Baking", "Lentils & Pulses", "Ready to Eat"];
  const brands = ["Royal Harvest", "Golden Grain", "Nature's Best", "Bulk Basics"];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-black font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between sticky top-0 z-50 shadow-sm shadow-purple-500/5 gap-4">
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
            <button className="text-gray-600 hover:text-purple-600 transition relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
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
                        onClick={() => {
                          setCartCount((c) => c + qty);
                          alert(`${qty} x "${product.name}" added to cart!`);
                        }}
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
    </div>
  );
}
