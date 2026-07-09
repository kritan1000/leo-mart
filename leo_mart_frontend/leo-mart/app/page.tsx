import React from "react";
import Link from "next/link";
import { ShoppingCart, User, ArrowRight, Star, ShieldCheck, Truck, Percent } from "lucide-react";
import { fetchProductsAction } from "@/lib/actions/product-action";
import { LeoMartLogo } from "./(auth)/_components/type/AuthComponent";

export default async function HomePage() {
  // Fetch products dynamically from backend
  const res = await fetchProductsAction({ page: 1, size: 8 });
  const products = res.success && res.data ? res.data.data : [];

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-12">
          <Link href="/">
            <LeoMartLogo size={28} />
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link href="/groceries" className="hover:text-purple-600 transition">
              Categories
            </Link>
            <Link href="/groceries" className="hover:text-purple-600 transition">
              Groceries
            </Link>
            <Link href="/wholesale" className="hover:text-purple-600 transition">
              Bulk Orders
            </Link>
            <span className="hover:text-purple-600 transition cursor-pointer">
              Business Services
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/groceries" className="text-gray-600 hover:text-purple-600 transition relative">
            <ShoppingCart size={22} />
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition">
            <User size={22} />
          </Link>
        </div>
      </header>

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
              <div 
                key={product._id} 
                className="group bg-white border border-purple-100/50 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {product.stockStatus === "bulk-deal" && (
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm z-10 uppercase tracking-wider">
                    Bulk Deal
                  </span>
                )}
                {product.stockStatus === "low-stock" && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm z-10 uppercase tracking-wider">
                    Low Stock
                  </span>
                )}

                <div className="space-y-4">
                  {/* Image container */}
                  <div className="w-full aspect-square bg-purple-50/10 rounded-xl overflow-hidden border border-purple-50 flex items-center justify-center relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Meta data */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider block">
                      {product.brand} • {product.category}
                    </span>
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-purple-600 transition">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px]">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-50 mt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 block font-medium">Price</span>
                    <span className="text-base font-extrabold text-purple-700">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href={`/groceries?search=${encodeURIComponent(product.name)}`}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-600 p-2 rounded-xl active:scale-95 transition"
                  >
                    <ShoppingCart size={18} />
                  </Link>
                </div>
              </div>
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
      <footer className="bg-white border-t border-gray-100 py-8 px-6 md:px-12 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Leo Mart. All Rights Reserved. Pricing in Nepalese Rupees (Rs. / NPR).</p>
      </footer>
    </div>
  );
}
