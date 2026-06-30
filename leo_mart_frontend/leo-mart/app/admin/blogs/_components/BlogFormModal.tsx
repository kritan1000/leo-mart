"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createBlogAction, updateBlogAction } from "@/lib/actions/blog-action";

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogToEdit?: { _id: string; title: string; content: string; tags?: string[] } | null;
  onSuccess: () => void;
}

export default function BlogFormModal({ isOpen, onClose, blogToEdit, onSuccess }: BlogFormModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title);
      setContent(blogToEdit.content);
      setTags(blogToEdit.tags?.join(", ") || "");
    } else {
      setTitle("");
      setContent("");
      setTags("");
    }
    setErrorMsg("");
  }, [blogToEdit, isOpen]);

  if (!isOpen) return null;

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
      let res;
      if (blogToEdit) {
        res = await updateBlogAction(blogToEdit._id, { title, content, tags: tagsArray });
      } else {
        res = await createBlogAction({ title, content, tags: tagsArray });
      }

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.message || "Something went wrong");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
      <div className="bg-white border border-purple-100 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-purple-50/50 border-b border-purple-100">
          <h3 className="font-bold text-gray-800 text-lg">
            {blogToEdit ? "Edit Blog Post" : "Create New Blog"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-purple-600 transition p-1 hover:bg-purple-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-2.5 rounded-lg text-center font-medium">
              {errorMsg}
            </div>
          )}

          {/* Title */}
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

          {/* Tags */}
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

          {/* Content */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Write your beautiful blog post content here..."
              className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-purple-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-md hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 transition"
            >
              {isSubmitting ? "Saving..." : blogToEdit ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
