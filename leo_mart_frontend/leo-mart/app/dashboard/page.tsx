"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";
import { User, LogOut, Settings, ShoppingBag, ShoppingCart, Sparkles, MapPin, Gift } from "lucide-react";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <div className="text-purple-600 text-sm font-semibold animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
      {/* Top Header/Nav */}
      <header className="bg-white border-b border-purple-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-12">
          <Link href="/">
            <LeoMartLogo size={26} />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link href="/groceries" className="hover:text-purple-600 transition">
              Groceries
            </Link>
            <Link href="/wholesale" className="hover:text-purple-600 transition">
              Wholesale Portal
            </Link>
            <Link href="/profile" className="hover:text-purple-600 transition">
              Account Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/groceries" className="text-gray-600 hover:text-purple-600 transition">
            <ShoppingCart size={22} />
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-semibold transition cursor-pointer"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Welcome Banner Card */}
        <div className="bg-white border border-purple-100 rounded-3xl p-8 shadow-xl shadow-purple-500/5 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 z-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles size={12} />
              Verified Account
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span className="text-purple-600">{user?.fullname || "Customer"}</span>!
            </h1>
            <p className="text-sm text-gray-500 max-w-md">
              Access fresh catalog items, review your settings, and order premium grocery supplies at competitive rates.
            </p>
          </div>
          <div className="flex flex-col gap-3 justify-center sm:justify-end shrink-0 z-10">
            <Link
              href="/groceries"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-purple-500/10 active:scale-95 transition text-center text-sm"
            >
              Start Shopping
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-1.5 border border-purple-100 hover:border-purple-300 bg-white text-purple-600 hover:bg-purple-50/20 px-6 py-3 rounded-xl text-sm font-semibold transition active:scale-95"
            >
              <Settings size={16} />
              Manage Profile
            </Link>
          </div>
          
          {/* Background overlay design details */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-100/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white border border-purple-100/60 rounded-3xl p-6 shadow-xl shadow-purple-500/5 flex flex-col justify-between space-y-4">
            <div className="flex gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center h-12 w-12 shrink-0">
                <User size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-800 text-sm">Account Overview</h3>
                <span className="text-[10px] text-gray-400 block font-medium">Personal Information</span>
              </div>
            </div>
            
            <div className="space-y-2 border-t border-purple-50/80 pt-4 text-xs text-gray-600">
              <p><span className="font-semibold text-gray-800">Email:</span> {user?.email}</p>
              <p><span className="font-semibold text-gray-800">Username:</span> {user?.username || "-"}</p>
              <p><span className="font-semibold text-gray-800">Role Status:</span> <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">{user?.role}</span></p>
            </div>
          </div>

          {/* Activity/Order Card */}
          <div className="bg-white border border-purple-100/60 rounded-3xl p-6 shadow-xl shadow-purple-500/5 flex flex-col justify-between space-y-4">
            <div className="flex gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center h-12 w-12 shrink-0">
                <ShoppingBag size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-800 text-sm">Shopping Activity</h3>
                <span className="text-[10px] text-gray-400 block font-medium">Recent Orders</span>
              </div>
            </div>
            
            <div className="space-y-1 border-t border-purple-50/80 pt-4 text-xs text-gray-600">
              <p className="italic text-gray-400">No recent orders placed yet.</p>
              <Link href="/groceries" className="text-purple-600 font-semibold block pt-2 hover:underline">
                Browse catalog →
              </Link>
            </div>
          </div>

          {/* Exclusive Perks Card */}
          <div className="bg-white border border-purple-100/60 rounded-3xl p-6 shadow-xl shadow-purple-500/5 flex flex-col justify-between space-y-4">
            <div className="flex gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center h-12 w-12 shrink-0">
                <Gift size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-800 text-sm">LeoMart Rewards</h3>
                <span className="text-[10px] text-gray-400 block font-medium">Member benefits</span>
              </div>
            </div>
            
            <div className="space-y-2 border-t border-purple-50/80 pt-4 text-xs text-gray-600">
              <p>🎁 Enjoy free delivery on orders above Rs. 5,000.</p>
              <p>💼 Willing to buy in bulk? <Link href="/wholesale" className="text-purple-600 font-semibold hover:underline">Apply for wholesale rates</Link>.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
