"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { updateBlogAction } from "@/lib/actions/blog-action";

interface EditBlogFormProps {
  blog: {
    _id: string;
    title: string;
    content: string;
    tags?: string[];
  };
}

export default function EditBlogForm({ blog }: EditBlogFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [tags, setTags] = useState(blog.tags?.join(", ") || "");
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
      const res = await updateBlogAction(blog._id, { title, content, tags: tagsArray });

      if (res.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMsg(res.message || "Failed to update blog post");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            href="/admin/dashboard"
            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-purple-600 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-md hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 transition"
          >
            {isSubmitting ? "Updating..." : "Update Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
