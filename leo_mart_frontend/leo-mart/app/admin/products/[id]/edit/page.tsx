import { fetchProductByIdAction } from "@/lib/actions/product-action";
import EditProductForm from "../../../_components/EditProductForm";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { LeoMartLogo } from "../../../../(auth)/_components/type/AuthComponent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const productResponse = await fetchProductByIdAction(id);

  if (!productResponse.success) {
    throw new Error(productResponse.message || "Failed to fetch product data");
  }

  if (!productResponse.data) {
    throw new Error("No product data available");
  }

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
            <span className="text-purple-600 font-semibold">Edit Product</span>
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
              Edit Product Details
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Modify details for {productResponse.data.name}.
          </p>
        </div>

        <div>
          <EditProductForm product={productResponse.data} />
        </div>
      </main>
    </div>
  );
}
