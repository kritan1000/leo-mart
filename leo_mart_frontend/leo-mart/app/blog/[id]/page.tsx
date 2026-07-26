import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogByIdAction } from "@/lib/actions/blog-action";
import HomeHeader from "../../_components/HomeHeader";
import { ArrowLeft, ChevronRight, Calendar, User } from "lucide-react";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetchBlogByIdAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const blog = res.data;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-black font-sans flex flex-col">
      <HomeHeader />

      {/* Breadcrumb */}
      <div className="max-w-4xl w-full mx-auto px-6 md:px-12 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-purple-600 transition">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/blog" className="hover:text-purple-600 transition">
            Blog
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium truncate max-w-[200px]">
            {blog.title}
          </span>
        </nav>
      </div>

      {/* Article */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 md:px-12 pb-16">
        <article className="bg-white border border-purple-100/60 rounded-3xl shadow-sm overflow-hidden">
          {blog.image && (
            <div className="w-full aspect-video bg-purple-50/30">
              <img
                src={blog.image}
                alt={blog.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="p-8 md:p-12 space-y-6">
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <User size={12} />
                {blog.author?.fullname || "Leo Mart"}
              </span>
              {blog.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            <div className="pt-4 border-t border-purple-50">
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>
          </div>
        </article>

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </main>
    </div>
  );
}
