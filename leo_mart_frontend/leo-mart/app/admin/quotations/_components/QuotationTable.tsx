"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, RefreshCw } from "lucide-react";
import { updateQuotationStatusAction } from "@/lib/actions/quotation-action";

interface QuotationTableProps {
  quotations: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export default function QuotationTable({
  quotations,
  total,
  totalPages,
  currentPage,
  pageSize,
}: QuotationTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const buildUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    params.set("size", pageSize.toString());
    params.set("tab", "quotes"); // ensure tab stays quotes
    return `${pathname}?${params.toString()}`;
  };

  const handleStatusChange = async (id: string, nextStatus: "pending" | "reviewed" | "completed") => {
    setIsUpdating(id);
    try {
      const res = await updateQuotationStatusAction(id, nextStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.message || "Failed to update quotation status");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-500/5 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Wholesale Quotation Requests</h2>
        <span className="text-xs text-gray-400">Total: {total} requests</span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-purple-100/60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50/50 border-b border-purple-100 text-gray-600 font-semibold text-sm">
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Requested Sourcing List</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50/80 text-sm text-gray-700">
            {quotations.length > 0 ? (
              quotations.map((quote) => (
                <tr key={quote._id} className="hover:bg-purple-50/10 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {quote.companyName}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="block font-medium text-gray-800">{quote.email}</span>
                    <span className="text-xs block">{quote.phone}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs">
                    <p className="text-xs line-clamp-2 italic">"{quote.items}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        quote.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : quote.status === "reviewed"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {quote.status === "completed"
                        ? "Completed"
                        : quote.status === "reviewed"
                        ? "Reviewed"
                        : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {quote.status !== "reviewed" && quote.status !== "completed" && (
                        <button
                          onClick={() => handleStatusChange(quote._id, "reviewed")}
                          disabled={isUpdating === quote._id}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition disabled:opacity-50"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {quote.status !== "completed" && (
                        <button
                          onClick={() => handleStatusChange(quote._id, "completed")}
                          disabled={isUpdating === quote._id}
                          className="bg-green-50 hover:bg-green-100 text-green-600 text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition disabled:opacity-50"
                        >
                          Mark Completed
                        </button>
                      )}
                      {quote.status === "completed" && (
                        <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={14} /> Done
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 font-medium">
                  No quotation requests submitted yet.
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
