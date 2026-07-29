"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";
import { User, LogOut, Settings, ShoppingBag, ShoppingCart, Sparkles, Building2, Star, Award, TrendingUp, Package } from "lucide-react";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const { setIsCartOpen } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <div className="text-purple-600 text-sm font-semibold animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  const loyaltyPoints = user?.loyaltyPoints || 0;
  
  // Calculate Loyalty Tier based on points
  let tier = "Bronze Member";
  let tierColor = "bg-amber-100 text-amber-800";
  let nextTierRequirement = 100;

  if (loyaltyPoints >= 1000) {
    tier = "Platinum VIP";
    tierColor = "bg-purple-600 text-white font-extrabold";
    nextTierRequirement = 5000;
  } else if (loyaltyPoints >= 500) {
    tier = "Gold Member";
    tierColor = "bg-amber-400 text-gray-900 font-extrabold";
    nextTierRequirement = 1000;
  } else if (loyaltyPoints >= 100) {
    tier = "Silver Member";
    tierColor = "bg-slate-200 text-slate-800 font-extrabold";
    nextTierRequirement = 500;
  }

  const businessStatus = user?.businessAccount?.status || "none";

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
            <Link href="/dashboard/orders" className="hover:text-purple-600 transition">
              My Orders
            </Link>
            <Link href="/profile" className="hover:text-purple-600 transition">
              Account Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsCartOpen(true)} className="text-gray-600 hover:text-purple-600 transition cursor-pointer">
            <ShoppingCart size={22} />
          </button>
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
            <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles size={12} />
              <span>Verified Account</span>
              <span className={`ml-2 text-[9px] px-2 py-0.5 rounded-full ${tierColor}`}>
                {tier}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span className="text-purple-600">{user?.fullname || "Customer"}</span>!
            </h1>
            <p className="text-sm text-gray-500 max-w-md">
              Earn reward points on every purchase, access wholesale catalogs, and manage your account details.
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
              href="/dashboard/orders"
              className="inline-flex items-center justify-center gap-1.5 border border-purple-100 hover:border-purple-300 bg-white text-purple-600 hover:bg-purple-50/20 px-6 py-3 rounded-xl text-sm font-semibold transition active:scale-95"
            >
              <ShoppingBag size={16} />
              My Orders
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-1.5 border border-purple-100 hover:border-purple-300 bg-white text-purple-600 hover:bg-purple-50/20 px-6 py-3 rounded-xl text-sm font-semibold transition active:scale-95"
            >
              <Settings size={16} />
              Manage Profile
            </Link>
          </div>
          
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-100/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Loyalty Reward Points System Card */}
          <div className="bg-white border border-purple-100/80 rounded-3xl p-6 shadow-xl shadow-purple-500/5 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center h-12 w-12 shrink-0">
                  <Star size={24} className="fill-purple-600 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Loyalty Points</h3>
                  <span className="text-[10px] text-purple-600 font-bold block">Reward Program</span>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${tierColor}`}>
                {tier}
              </span>
            </div>

            <div className="space-y-2 border-t border-purple-50/80 pt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-purple-700">{loyaltyPoints}</span>
                <span className="text-xs font-bold text-gray-400">Pts</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                ⭐ Earn 1 point for every Rs. 100 spent! Small purchases = small points, big purchases = big points.
              </p>
              
              <div className="w-full bg-purple-50 rounded-full h-1.5 overflow-hidden mt-2">
                <div 
                  className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (loyaltyPoints / nextTierRequirement) * 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-gray-400 block text-right font-medium">
                {nextTierRequirement - loyaltyPoints > 0 ? `${nextTierRequirement - loyaltyPoints} pts to next tier` : "Top Tier Unlocked!"}
              </span>
            </div>
          </div>

          {/* 2. My Orders Card */}
          <Link
            href="/dashboard/orders"
            className="bg-white border border-purple-100/80 rounded-3xl p-6 shadow-xl shadow-purple-500/5 flex flex-col justify-between space-y-4 hover:shadow-purple-500/10 transition group"
          >
            <div className="flex gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center h-12 w-12 shrink-0">
                <Package size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-800 text-sm">My Orders</h3>
                <span className="text-[10px] text-gray-400 block font-medium">Order History & Tracking</span>
              </div>
            </div>
            
            <div className="space-y-3 border-t border-purple-50/80 pt-4 text-xs text-gray-600">
              <p>View all your past purchases, track delivery status, and earn loyalty points on every order.</p>
              <span className="w-full bg-purple-50 group-hover:bg-purple-100 text-purple-700 text-center font-bold py-2 rounded-xl text-xs block transition">
                View Order History →
              </span>
            </div>
          </Link>

          {/* 3. Business Account B2B Card */}
          <div className="bg-white border border-purple-100/80 rounded-3xl p-6 shadow-xl shadow-purple-500/5 flex flex-col justify-between space-y-4">
            <div className="flex gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center h-12 w-12 shrink-0">
                <Building2 size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-800 text-sm">Business Account</h3>
                <span className="text-[10px] text-gray-400 block font-medium">B2B Wholesale Portal</span>
              </div>
            </div>
            
            <div className="space-y-3 border-t border-purple-50/80 pt-4 text-xs text-gray-600">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">B2B Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                  businessStatus === "approved"
                    ? "bg-green-50 text-green-700"
                    : businessStatus === "pending"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {businessStatus === "approved" ? "Approved Member" : businessStatus === "pending" ? "Pending Review" : "Not Registered"}
                </span>
              </div>

              {user?.businessAccount?.businessName && (
                <p><span className="font-semibold text-gray-800">Business:</span> {user.businessAccount.businessName}</p>
              )}

              <Link
                href="/wholesale"
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-center font-bold py-2 rounded-xl text-xs block transition"
              >
                {businessStatus === "none" ? "Apply for Business Account →" : "View Wholesale Portal →"}
              </Link>
            </div>
          </div>

          {/* 3. Account Overview Card */}
          <div className="bg-white border border-purple-100/80 rounded-3xl p-6 shadow-xl shadow-purple-500/5 flex flex-col justify-between space-y-4">
            <div className="flex gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center h-12 w-12 shrink-0">
                <User size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-800 text-sm">Personal Info</h3>
                <span className="text-[10px] text-gray-400 block font-medium">Account Details</span>
              </div>
            </div>
            
            <div className="space-y-2 border-t border-purple-50/80 pt-4 text-xs text-gray-600">
              <p><span className="font-semibold text-gray-800">Email:</span> {user?.email}</p>
              <p><span className="font-semibold text-gray-800">Username:</span> {user?.username || "-"}</p>
              <p><span className="font-semibold text-gray-800">Role:</span> <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">{user?.role}</span></p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
