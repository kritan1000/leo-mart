import React from "react";
import Link from "next/link";
import { fetchBlogsAction } from "@/lib/actions/blog-action";
import HomeHeader from "../_components/HomeHeader";
import { BookOpen, ArrowRight } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
  }>;
}

export default async function BlogListPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const size = parseInt(resolvedParams.size || "12", 10);

  const res = await fetchBlogsAction({ page, size });
  const blogsData = res.success && res.data ? res.data : { data: [], total: 0, totalPages: 0 };
  const blogs = blogsData.data || [];
  const totalPages = blogsData.totalPages || 0;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-black font-sans flex flex-col">
      <HomeHeader />

      {/* Hero */}
      <section className="bg-white border-b border-purple-50 py-12">
        <div className="max-w-6xl w-full mx-auto px-6 md:px-12 space-y-3">
          <div className="flex items-center gap-2 text-purple-600">
            <BookOpen size={24} />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Our Blog
            </h1>
          </div>
          <p className="text-sm text-gray-500 max-w-xl">
            Stay updated with the latest news, recipes, and grocery tips from Leo Mart.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 py-10">
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog: any) => (
              <Link
                key={blog._id}
                href={`/blog/${blog._id}`}
                className="group bg-white border border-purple-100/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition duration-300"
              >
                {blog.image && (
                  <div className="w-full aspect-video bg-purple-50/30 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.slice(0, 3).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="font-bold text-gray-800 text-base line-clamp-2 group-hover:text-purple-600 transition">
                    {blog.title}
                  </h2>
                  <p className="text-xs text-gray-400 line-clamp-3 min-h-[40px]">
                    {blog.content?.replace(/<[^>]*>/g, "").slice(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-purple-50">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {blog.author?.fullname || "Leo Mart"}
                    </span>
                    <span className="text-[10px] text-purple-600 font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                      Read More <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-purple-100 rounded-3xl bg-white">
            <BookOpen className="mx-auto text-purple-200 mb-4" size={48} />
            <span className="text-gray-400 font-semibold block text-sm">
              No blog posts yet
            </span>
            <p className="text-xs text-gray-400 mt-1">
              Check back soon for the latest updates and recipes.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageIndex = i + 1;
              return (
                <Link
                  key={pageIndex}
                  href={`/blog?page=${pageIndex}&size=${size}`}
                  className={`w-9 h-9 text-sm font-semibold rounded-xl flex items-center justify-center transition ${
                    pageIndex === page
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/10"
                      : "border border-purple-100 hover:bg-purple-50/50 text-gray-600"
                  }`}
                >
                  {pageIndex}
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6 md:px-12 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Leo Mart. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
