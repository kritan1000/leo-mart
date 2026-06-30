import { fetchBlogByIdAction } from "@/lib/actions/blog-action";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { LeoMartLogo } from "../../../(auth)/_components/type/AuthComponent";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blogResponse = await fetchBlogByIdAction(id);

  if (!blogResponse.success) {
    throw new Error(blogResponse.message || 'Failed to fetch blog');
  }
  if (!blogResponse.data) {
    throw new Error('No blog data available');
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
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
            <Link href="/admin/blogs" className="hover:text-purple-600 transition">
              Blogs Admin
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-purple-600 font-semibold">View</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            <ArrowLeft size={16} />
            Back to Blogs List
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-500/5 p-6">
          <div className="mt-4">
            <div className="text-2xl font-semibold mb-6">Blog Details</div>
            
            <div className="mb-4 text-purple-600 font-medium">
              Author Email: {blogResponse.data.author?.email || blogResponse.data.authorId?.email || "Unknown Author"}
            </div>
            
            <div className="mb-4 text-xl font-bold text-gray-800">
              Blog Title: {blogResponse.data.title}
            </div>
            
            <div className="mb-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
              Blog Content: {blogResponse.data.content}
            </div>

            {blogResponse.data.tags && blogResponse.data.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-purple-50">
                {blogResponse.data.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-purple-50 text-purple-600 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
