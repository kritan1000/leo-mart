import React from "react";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Percent } from "lucide-react";
import { fetchProductsAction } from "@/lib/actions/product-action";
import HomeHeader from "./_components/HomeHeader";
import ProductCard from "./_components/ProductCard";

export default async function HomePage() {
  // Fetch products dynamically from backend
  const res = await fetchProductsAction({ page: 1, size: 8 });
  const products = res.success && res.data ? res.data.data : [];

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <HomeHeader />

      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center bg-[#FAFAFC] border-b border-purple-50 overflow-hidden">
        {/* Background Image opacity effect */}
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1474&auto=format&fit=crop')",
          }}
        />
        <div className="relative max-w-6xl w-full mx-auto px-6 md:px-12 py-16 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-2xl">
            Quality Groceries, <br />
            <span className="text-purple-600">Delivered to Your Door.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-xl leading-relaxed">
            From daily household essentials to high-volume business supplies, Leo Mart provides fresh, reliable products with speed and precision.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/groceries"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/wholesale"
              className="border-2 border-purple-100 hover:border-purple-300 bg-white text-purple-600 hover:bg-purple-50/20 font-semibold px-8 py-3.5 rounded-xl active:scale-95 transition"
            >
              Explore Bulk Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl w-full mx-auto px-6 md:px-12 py-16 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Featured Products</h2>
          <Link
            href="/groceries"
            className="text-purple-600 hover:text-purple-800 text-sm font-bold flex items-center gap-1 transition"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center space-y-2 border border-dashed border-purple-100 rounded-3xl bg-purple-50/5">
              <span className="text-gray-400 font-semibold block">No products in catalog</span>
              <p className="text-xs text-gray-400">Add products from the admin inventory panel to list them here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-[#FAFAFC] border-t border-purple-50 py-16">
        <div className="max-w-6xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl h-fit">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800">100% Quality Assurance</h4>
              <p className="text-xs text-gray-400 leading-relaxed">We source directly from premium farms and trusted producers ensuring utmost hygiene and quality.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl h-fit">
              <Truck size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800">Prompt & Safe Delivery</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Fast delivery to homes and business centers with temperature-controlled logistics.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl h-fit">
              <Percent size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800">Wholesale Bulk Rates</h4>
              <p className="text-xs text-gray-400 leading-relaxed">High-volume business accounts unlock exclusive bulk tier catalog prices automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-extrabold text-gray-900 text-sm">Leo Mart</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Quality groceries delivered to your door. From daily essentials to bulk business supplies.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider">Shop</h4>
            <div className="space-y-2">
              <Link href="/groceries" className="block text-xs text-gray-400 hover:text-purple-600 transition">Groceries</Link>
              <Link href="/wholesale" className="block text-xs text-gray-400 hover:text-purple-600 transition">Bulk Orders</Link>
              <Link href="/blog" className="block text-xs text-gray-400 hover:text-purple-600 transition">Blog</Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider">Account</h4>
            <div className="space-y-2">
              <Link href="/login" className="block text-xs text-gray-400 hover:text-purple-600 transition">Login</Link>
              <Link href="/Register" className="block text-xs text-gray-400 hover:text-purple-600 transition">Register</Link>
              <Link href="/dashboard" className="block text-xs text-gray-400 hover:text-purple-600 transition">Dashboard</Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider">Contact</h4>
            <div className="space-y-2">
              <p className="text-xs text-gray-400">Kathmandu, Nepal</p>
              <p className="text-xs text-gray-400">info@leomart.com</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Leo Mart. All Rights Reserved. Pricing in Nepalese Rupees (Rs. / NPR).</p>
        </div>
      </footer>
    </div>
  );
}
