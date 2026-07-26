import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { fetchQuotationsAction } from "@/lib/actions/quotation-action";
import QuotationTable from "./_components/QuotationTable";
import { LeoMartLogo } from "../../(auth)/_components/type/AuthComponent";
import LogoutButton from "../_components/LogoutButton";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
  }>;
}

export default async function AdminQuotationsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const size = parseInt(resolvedParams.size || "10", 10);

  const res = await fetchQuotationsAction({ page, size });
  const quotationsData = res.success && res.data ? res.data : { data: [], total: 0, totalPages: 0 };
  const quotations = quotationsData.data || [];
  const total = quotationsData.total || 0;
  const totalPages = quotationsData.totalPages || 0;

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 py-4 px-6 flex items-center justify-between shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="transition hover:opacity-90">
            <LeoMartLogo size={24} />
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/admin/dashboard" className="hover:text-purple-600 transition">
              Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-purple-600 font-semibold">Quotations</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            Back to Dashboard
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-600">
              <MessageSquare size={24} />
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                Quotation Management
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              Review and manage wholesale quotation requests from businesses.
            </p>
          </div>
        </div>

        <QuotationTable
          quotations={quotations}
          total={total}
          totalPages={totalPages}
          currentPage={page}
          pageSize={size}
        />
      </main>
    </div>
  );
}
