import React from "react";
import Link from "next/link";
import { Users, UserPlus, Shield, UserCheck } from "lucide-react";
import { fetchUsersAction } from "@/lib/actions/user-action";
import UserTable from "../users/_components/UserTable";
import { LeoMartLogo } from "../../(auth)/_components/type/AuthComponent";
import LogoutButton from "../_components/LogoutButton";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    search?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  // Await searchParams as required in Next.js 15+
  const resolvedParams = await searchParams;

  // Converts string params to numbers with default values
  const page = parseInt(resolvedParams.page || "1", 10);
  const size = parseInt(resolvedParams.size || "10", 10);
  const search = resolvedParams.search || "";

  // API Call - Fetches users via fetchUsersAction
  const res = await fetchUsersAction({ page, size, search });

  const usersData = res.success && res.data ? res.data : { data: [], total: 0, totalPages: 0 };
  const users = usersData.data || [];
  const total = usersData.total || 0;
  const totalPages = usersData.totalPages || 0;

  // Calculate quick stats (estimate from the loaded page)
  const adminCount = users.filter((u: any) => u.role === "admin").length;
  const customerCount = users.filter((u: any) => u.role !== "admin").length;

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 py-4 px-6 flex items-center justify-between shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="transition hover:opacity-90">
            <LeoMartLogo size={24} />
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className="text-purple-600 font-semibold">Admin Dashboard</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LogoutButton />
        </div>
      </header>

      {/* Main Admin Page Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome to the User Manager</h1>
          <p className="text-sm text-gray-500">Add, view, edit or remove user accounts across the platform.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-purple-100/60 rounded-2xl shadow-xl shadow-purple-500/5 p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-gray-500 font-medium">Total Registered Users</span>
              <h3 className="text-3xl font-bold text-gray-800">{total}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-white border border-purple-100/60 rounded-2xl shadow-xl shadow-purple-500/5 p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-gray-500 font-medium">Admins Count (This Page)</span>
              <h3 className="text-3xl font-bold text-gray-800">{adminCount}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Shield size={24} />
            </div>
          </div>

          <div className="bg-white border border-purple-100/60 rounded-2xl shadow-xl shadow-purple-500/5 p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-gray-500 font-medium">Customers Count (This Page)</span>
              <h3 className="text-3xl font-bold text-gray-800">{customerCount}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        {/* Display User Table Component */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">System Users</h2>
            <Link
              href="/admin/users/create"
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
            >
              <UserPlus size={16} />
              Add User
            </Link>
          </div>
          <UserTable
            users={users}
            total={total}
            totalPages={totalPages}
            currentPage={page}
            pageSize={size}
            initialSearch={search}
          />
        </div>
      </main>
    </div>
  );
}
