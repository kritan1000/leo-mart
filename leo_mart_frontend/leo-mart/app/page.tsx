import React from "react";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Percent } from "lucide-react";
import { fetchProductsAction } from "@/lib/actions/product-action";
import HomeHeader from "./_components/HomeHeader";
import ProductCard from "./_components/ProductCard";

export default async function HomePage() {
  const res = await fetchProductsAction({ page: 1, size: 8 });
  const products = res.success && res.data ? res.data.data : [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f14] text-gray-900 dark:text-gray-100 font-sans flex flex-col">
      <HomeHeader />

      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center bg-[#FAFAFC] dark:bg-[#14141c] border-b border-purple-50 dark:border-purple-950/50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 dark:opacity-10 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1474&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent dark:from-[#0f0f14]/95 dark:via-[#0f0f14]/80 pointer-events-none" />
        <div className="relative max-w-6xl w-full mx-auto px-6 md:px-12 py-16 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold w-fit border border-purple-200/50 dark:border-purple-800/50">
            <Star size={12} className="fill-current" />
            Nepal's #1 Grocery Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight max-w-2xl">
            Quality Groceries, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              Delivered to Your Door.
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
            From daily household essentials to high-volume business supplies,
            Leo Mart provides fresh, reliable products with speed and precision.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/groceries"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 active:scale-95 transition-all"
            >
              Shop Now
            </Link>
            <Link
              href="/wholesale"
              className="border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 bg-white/50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 font-semibold px-8 py-3.5 rounded-xl active:scale-95 transition-all backdrop-blur-sm"
            >
              Explore Bulk Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl w-full mx-auto px-6 md:px-12 py-16 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Featured Products
          </h2>
          <Link
            href="/groceries"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-bold flex items-center gap-1 transition group"
          >
            View All
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center space-y-2 border border-dashed border-purple-200 dark:border-purple-800 rounded-3xl bg-purple-50/5 dark:bg-purple-950/10">
              <span className="text-gray-400 font-semibold block">
                No products in catalog
              </span>
              <p className="text-xs text-gray-400">
                Add products from the admin inventory panel to list them here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-[#FAFAFC] dark:bg-[#14141c] border-t border-purple-50 dark:border-purple-950/50 py-16">
        <div className="max-w-6xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4 group">
            <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 text-purple-600 dark:text-purple-400 rounded-2xl h-fit group-hover:scale-110 transition-transform shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800 dark:text-gray-200">
                100% Quality Assurance
              </h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                We source directly from premium farms and trusted producers
                ensuring utmost hygiene and quality.
              </p>
            </div>
          </div>
          <div className="flex gap-4 group">
            <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 text-purple-600 dark:text-purple-400 rounded-2xl h-fit group-hover:scale-110 transition-transform shadow-sm">
              <Truck size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800 dark:text-gray-200">
                Prompt & Safe Delivery
              </h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                Fast delivery to homes and business centers with
                temperature-controlled logistics.
              </p>
            </div>
          </div>
          <div className="flex gap-4 group">
            <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 text-purple-600 dark:text-purple-400 rounded-2xl h-fit group-hover:scale-110 transition-transform shadow-sm">
              <Percent size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800 dark:text-gray-200">
                Wholesale Bulk Rates
              </h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                High-volume business accounts unlock exclusive bulk tier catalog
                prices automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0a0a0f] border-t border-gray-100 dark:border-gray-800 py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">
              Leo Mart
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Quality groceries delivered to your door. From daily essentials to
              bulk business supplies.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
              Shop
            </h4>
            <div className="space-y-2">
              <Link
                href="/groceries"
                className="block text-xs text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Groceries
              </Link>
              <Link
                href="/wholesale"
                className="block text-xs text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Bulk Orders
              </Link>
              <Link
                href="/blog"
                className="block text-xs text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Blog
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
              Account
            </h4>
            <div className="space-y-2">
              <Link
                href="/login"
                className="block text-xs text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Login
              </Link>
              <Link
                href="/Register"
                className="block text-xs text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Register
              </Link>
              <Link
                href="/dashboard"
                className="block text-xs text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-2">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Kathmandu, Nepal
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                info@leomart.com
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Leo Mart. All Rights Reserved.
            Pricing in Nepalese Rupees (Rs. / NPR).
          </p>
        </div>
      </footer>
    </div>
  );
}
