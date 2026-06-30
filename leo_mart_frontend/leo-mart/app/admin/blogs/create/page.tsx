"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { createBlogAction } from "@/lib/actions/blog-action";
import { LeoMartLogo } from "../../../(auth)/_components/type/AuthComponent";

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim() || !content.trim()) {
      setErrorMsg("Title and Content are required");
      return;
    }

    setIsSubmitting(true);
    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await createBlogAction({ title, content, tags: tagsArray });

      if (res.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMsg(res.message || "Failed to create blog post");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
      <header className="bg-white border-b border-purple-100 py-4 px-6 flex items-center justify-between shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="transition hover:opacity-90">
            <LeoMartLogo size={24} />
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/admin/dashboard" className="hover:text-purple-600 transition">
              Admin Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-purple-600 font-semibold">Create</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-600">
            <BookOpen size={24} />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Create New Blog Post
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Fill in the details to publish a new blog post.
          </p>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-500/5 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-2.5 rounded-lg text-center font-medium">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Getting Started with Next.js Server Components"
                className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. nextjs, react, web-dev"
                className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Write your blog post content here..."
                className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <Link
                href="/admin/blogs"
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-purple-600 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-md hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 transition"
              >
                {isSubmitting ? "Creating..." : "Publish Blog Post"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
