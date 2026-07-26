import { fetchProductByIdAction } from "@/lib/actions/product-action";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Tag, Box, DollarSign, Layers } from "lucide-react";
import { LeoMartLogo } from "../../../(auth)/_components/type/AuthComponent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const productResponse = await fetchProductByIdAction(id);

  if (!productResponse.success) {
    throw new Error(productResponse.message || "Failed to fetch product details");
  }

  const product = productResponse.data;

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
      <header className="bg-white border-b border-purple-100 py-4 px-6 flex items-center justify-between shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="transition hover:opacity-90">
            <LeoMartLogo size={24} />
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/admin/dashboard?tab=products" className="hover:text-purple-600 transition">
              Admin Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-purple-600 font-semibold">Product Details</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard?tab=products"
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-600">
            <ShoppingBag size={24} />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Product Details
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            View full inventory details and descriptions for this catalog item.
          </p>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-500/5 p-8 space-y-6">
          <div className="flex flex-col items-center justify-center border-b border-purple-50 pb-6">
            <div className="w-48 h-48 rounded-2xl border border-purple-100 bg-purple-50/20 flex items-center justify-center overflow-hidden mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">{product.name}</h2>
            <span className="text-xs text-gray-400 mt-1">ID: {product._id}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5">
                <Box size={16} />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-400 block font-medium">Description</span>
                <span className="text-sm text-gray-700 leading-relaxed block">{product.description}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Layers size={16} />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-400 block font-medium">Category</span>
                  <span className="text-sm text-gray-800 font-semibold">{product.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Tag size={16} />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-400 block font-medium">Brand</span>
                  <span className="text-sm text-gray-800 font-semibold">{product.brand}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <span className="font-semibold text-sm">Rs.</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-400 block font-medium">Retail Price</span>
                  <span className="text-sm text-purple-700 font-bold">Rs. {product.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <span className="font-semibold text-xs">Stock</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-400 block font-medium">Stock Status</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold inline-block ${
                    product.stockStatus === "in-stock"
                      ? "bg-green-50 text-green-700"
                      : product.stockStatus === "bulk-deal"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-red-50 text-red-700"
                  }`}>
                    {product.stockStatus === "in-stock" ? "In Stock" : product.stockStatus === "bulk-deal" ? "Bulk Deal" : "Low Stock"}
                  </span>
                </div>
              </div>
            </div>

            {product.minBulkQty > 0 && (
              <div className="border-t border-purple-50 pt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <span className="font-semibold text-xs">Qty</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-400 block font-medium">Min Bulk Qty</span>
                    <span className="text-sm text-gray-800 font-semibold">{product.minBulkQty} units</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <span className="font-semibold text-xs">Rs.</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-400 block font-medium">Bulk Unit Price</span>
                    <span className="text-sm text-purple-700 font-bold">Rs. {product.bulkPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-purple-50 flex justify-end">
            <Link
              href={`/admin/products/${product._id}/edit`}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-xl text-sm shadow-md hover:shadow-lg transition active:scale-95 text-center block"
            >
              Edit Product
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
