"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Plus, Edit2, Trash2, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { deleteProductAction } from "@/lib/actions/product-action";

interface ProductTableProps {
  products: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  initialSearch: string;
}

export default function ProductTable({
  products,
  total,
  totalPages,
  currentPage,
  pageSize,
  initialSearch,
}: ProductTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [size, setSize] = useState(pageSize);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    setSearchTerm(initialSearch);
    setSize(pageSize);
  }, [initialSearch, pageSize]);

  const buildUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    params.set("size", size.toString());
    params.set("tab", "products"); // ensure tab stays products
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }
    return `${pathname}?${params.toString()}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl(1));
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("size", newSize.toString());
    params.set("tab", "products");
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    setIsDeleting(id);
    try {
      const res = await deleteProductAction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.message || "Failed to delete product");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-500/5 p-6 space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name..."
              className="w-full border border-purple-100/80 bg-purple-50/20 pl-10 pr-24 py-2.5 rounded-xl text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-1.5 rounded-lg text-xs shadow-md shadow-purple-500/10 transition active:scale-95"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Show:</span>
            <select
              value={size}
              onChange={(e) => handleSizeChange(Number(e.target.value))}
              className="border border-purple-100/80 px-2 py-1.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <button
            onClick={() => {
              router.push("/admin/products/create");
            }}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/15 transition hover:shadow-purple-500/25 active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-purple-100/60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50/50 border-b border-purple-100 text-gray-600 font-semibold text-sm">
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50/80 text-sm text-gray-700">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-purple-50/10 transition">
                  <td className="px-6 py-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg border border-purple-100"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 text-gray-500">{product.brand}</td>
                  <td className="px-6 py-4 font-semibold text-purple-700">
                    Rs. {product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        product.stockStatus === "in-stock"
                          ? "bg-green-50 text-green-700"
                          : product.stockStatus === "bulk-deal"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.stockStatus === "in-stock"
                        ? "In Stock"
                        : product.stockStatus === "bulk-deal"
                        ? "Bulk Deal"
                        : "Low Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          router.push(`/admin/products/${product._id}`);
                        }}
                        className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          router.push(`/admin/products/${product._id}/edit`);
                        }}
                        className="text-amber-600 hover:text-amber-800 p-2 hover:bg-amber-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={isDeleting === product._id}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400 font-medium">
                  No products found. Try adding one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-purple-50">
          <div className="text-sm text-gray-500">
            Showing Page <span className="font-semibold text-purple-600">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(buildUrl(currentPage - 1))}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 text-sm border border-purple-100 hover:border-purple-300 disabled:opacity-40 disabled:hover:border-purple-100 text-gray-600 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageIndex = i + 1;
              const isCurrent = pageIndex === currentPage;
              return (
                <button
                  key={pageIndex}
                  onClick={() => router.push(buildUrl(pageIndex))}
                  className={`w-9 h-9 text-sm font-semibold rounded-xl flex items-center justify-center transition cursor-pointer ${
                    isCurrent
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/10"
                      : "border border-purple-50 hover:bg-purple-50/50 text-gray-600"
                  }`}
                >
                  {pageIndex}
                </button>
              );
            })}

            <button
              onClick={() => router.push(buildUrl(currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 text-sm border border-purple-100 hover:border-purple-300 disabled:opacity-40 disabled:hover:border-purple-100 text-gray-600 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
