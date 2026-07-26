"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, XCircle, Clock, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { updateBusinessAccountStatusAction } from "@/lib/actions/user-action";

interface BusinessAccountUser {
  _id: string;
  fullname: string;
  email: string;
  businessAccount: {
    status: "pending" | "approved" | "rejected";
    businessName: string;
    registrationNo: string;
    businessType: string;
    appliedAt: string;
  };
}

interface BusinessAccountTableProps {
  users: BusinessAccountUser[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  currentFilter: string;
}

const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  approved: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Approved" },
  rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Rejected" },
};

export default function BusinessAccountTable({
  users,
  total,
  totalPages,
  currentPage,
  pageSize,
  currentFilter,
}: BusinessAccountTableProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (userId: string, status: "approved" | "rejected") => {
    setUpdatingId(userId);
    try {
      const result = await updateBusinessAccountStatusAction(userId, status);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch {
      alert("Failed to update business account");
    } finally {
      setUpdatingId(null);
    }
  };

  const buildPageUrl = (page: number, filter?: string) => {
    const params = new URLSearchParams();
    params.set("tab", "business-accounts");
    params.set("page", String(page));
    params.set("size", String(pageSize));
    if (filter) params.set("baStatus", filter);
    return `/admin/dashboard?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter:</span>
        {["", "pending", "approved", "rejected"].map((s) => (
          <a
            key={s}
            href={buildPageUrl(1, s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentFilter === s
                ? "bg-purple-600 text-white"
                : "bg-white border border-purple-100 text-gray-600 hover:bg-purple-50"
            }`}
          >
            {s ? statusConfig[s]?.label || s : "All"}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-purple-100/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-purple-50/50 border-b border-purple-100/60">
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Applicant</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Business</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Registration</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Applied</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {users.length > 0 ? (
                users.map((user) => {
                  const ba = user.businessAccount;
                  const cfg = statusConfig[ba.status] || statusConfig.pending;
                  const StatusIcon = cfg.icon;

                  return (
                    <tr key={user._id} className="hover:bg-purple-50/20 transition">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-800 block">{user.fullname}</span>
                        <span className="text-[10px] text-gray-400">{user.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-800 font-medium">{ba.businessName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-gray-600">{ba.registrationNo}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-600">{ba.businessType}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-500">{new Date(ba.appliedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${cfg.bg} ${cfg.color}`}>
                          <StatusIcon size={10} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {ba.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(user._id, "approved")}
                                disabled={updatingId === user._id}
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold transition disabled:opacity-50 flex items-center gap-1"
                              >
                                {updatingId === user._id ? <Loader2 className="animate-spin" size={10} /> : <CheckCircle2 size={10} />}
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(user._id, "rejected")}
                                disabled={updatingId === user._id}
                                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold transition disabled:opacity-50 flex items-center gap-1"
                              >
                                <XCircle size={10} />
                                Reject
                              </button>
                            </>
                          )}
                          {ba.status === "approved" && (
                            <button
                              onClick={() => handleStatusUpdate(user._id, "rejected")}
                              disabled={updatingId === user._id}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold transition disabled:opacity-50"
                            >
                              Revoke
                            </button>
                          )}
                          {ba.status === "rejected" && (
                            <button
                              onClick={() => handleStatusUpdate(user._id, "approved")}
                              disabled={updatingId === user._id}
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold transition disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <Building2 size={32} className="mx-auto mb-2 text-gray-300" />
                    No business account applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Page {currentPage} of {totalPages} ({total} applications)</span>
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <a
                href={buildPageUrl(currentPage - 1, currentFilter)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-purple-100 rounded-lg hover:bg-purple-50 transition"
              >
                <ChevronLeft size={14} /> Prev
              </a>
            )}
            {currentPage < totalPages && (
              <a
                href={buildPageUrl(currentPage + 1, currentFilter)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-purple-100 rounded-lg hover:bg-purple-50 transition"
              >
                Next <ChevronRight size={14} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
