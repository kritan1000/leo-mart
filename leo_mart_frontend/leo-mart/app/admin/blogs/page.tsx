import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { fetchBlogsAction } from "@/lib/actions/blog-action";
import BlogTable from "./_components/BlogTable";
import { LeoMartLogo } from "../../(auth)/_components/type/AuthComponent";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    search?: string;
  }>;
}

export default async function AdminBlogsPage({ searchParams }: PageProps) {
  // Await searchParams as required in Next.js 15+
  const resolvedParams = await searchParams;

  // Converts string params to numbers with default values
  const page = parseInt(resolvedParams.page || "1", 10);
  const size = parseInt(resolvedParams.size || "10", 10);
  const search = resolvedParams.search || "";

  // API Call - Fetches blogs via fetchBlogsAction
  const res = await fetchBlogsAction({ page, size, search });

  const blogsData = res.success && res.data ? res.data : { data: [], total: 0, totalPages: 0 };
  const blogs = blogsData.data || [];
  const total = blogsData.total || 0;
  const totalPages = blogsData.totalPages || 0;

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
      {/* Premium Purple Header */}
      <header className="bg-white border-b border-purple-100 py-4 px-6 flex items-center justify-between shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="transition hover:opacity-90">
            <LeoMartLogo size={24} />
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/dashboard" className="hover:text-purple-600 transition">
              Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-purple-600 font-semibold">Admin Panel</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Admin Page Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-600">
              <BookOpen size={24} />
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                Blogs Management
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              Create, read, update, and delete blog posts with pagination and search.
            </p>
          </div>
        </div>

        {/* Display Blog Table Component */}
        <BlogTable
          blogs={blogs}
          total={total}
          totalPages={totalPages}
          currentPage={page}
          pageSize={size}
          initialSearch={search}
        />
      </main>
    </div>
  );
}
