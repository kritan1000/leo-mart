"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";
import { User, LogOut, Settings, ShoppingBag } from "lucide-react";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-gray-500 text-sm animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col text-black font-sans">
      {/* Top Header/Nav */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <LeoMartLogo size={24} />
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link href="/dashboard" className="text-[#4F46E5] font-semibold">
              Dashboard
            </Link>
            <Link href="/profile" className="hover:text-[#4F46E5] transition">
              Profile
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
              Hi, {user.fullname}
            </span>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-medium transition cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-8 mb-8 text-center sm:text-left">
          <div className="sm:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome to LeoMart!</h1>
              <p className="text-gray-500 mt-2">
                This is your dashboard. You are successfully authenticated.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-3 justify-center sm:justify-end">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-sm text-sm font-medium transition"
              >
                <Settings size={16} />
                Manage Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6 flex gap-4">
            <div className="p-3 bg-indigo-50 text-[#4F46E5] rounded-sm flex items-center justify-center h-12 w-12">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Your Account</h3>
              <p className="text-sm text-gray-500 mt-1">Name: {user?.fullname}</p>
              <p className="text-sm text-gray-500">Email: {user?.email}</p>
              <p className="text-sm text-gray-500">Role: {user?.role}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6 flex gap-4">
            <div className="p-3 bg-indigo-50 text-[#4F46E5] rounded-sm flex items-center justify-center h-12 w-12">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Activity & Shopping</h3>
              <p className="text-sm text-gray-500 mt-1">No recent purchases found.</p>
              <p className="text-xs text-indigo-600 font-medium mt-2 cursor-pointer hover:underline">
                Explore Store Catalog →
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
