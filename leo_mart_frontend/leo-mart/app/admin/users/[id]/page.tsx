import { fetchUserByIdAction } from "@/lib/actions/user-action";
import Link from "next/link";
import { ArrowLeft, User, Shield, Calendar, Mail } from "lucide-react";
import { LeoMartLogo } from "../../../(auth)/_components/type/AuthComponent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const userResponse = await fetchUserByIdAction(id);

  if (!userResponse.success) {
    throw new Error(userResponse.message || "Failed to fetch user details");
  }

  const user = userResponse.data;

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
            <span className="text-purple-600 font-semibold">User Details</span>
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

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-600">
            <User size={24} />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              User Details
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            View detailed profile information for this account.
          </p>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-500/5 p-8 space-y-6">
          {/* Avatar Area */}
          <div className="flex flex-col items-center justify-center border-b border-purple-50 pb-6">
            <div className="w-20 h-20 rounded-full border-2 border-purple-100 bg-purple-50 flex items-center justify-center text-purple-600 text-3xl font-bold mb-3 shadow-inner">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.fullname}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                user.fullname.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user.fullname}</h2>
            <span className="text-xs text-gray-400 mt-1">ID: {user._id}</span>
          </div>

          {/* Details Metadata List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <User size={16} />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-400 block font-medium">Username</span>
                <span className="text-sm text-gray-800 font-semibold">{user.username || "-"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Mail size={16} />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-400 block font-medium">Email Address</span>
                <span className="text-sm text-gray-800 font-semibold">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Shield size={16} />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-400 block font-medium">Role</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold inline-block ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Calendar size={16} />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-400 block font-medium">Registered Since</span>
                <span className="text-sm text-gray-800 font-semibold">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-50 flex justify-end">
            <Link
              href={`/admin/users/${user._id}/edit`}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-xl text-sm shadow-md hover:shadow-lg transition active:scale-95 text-center block"
            >
              Edit Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
