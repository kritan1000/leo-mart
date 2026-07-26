"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Search } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";

export default function HomeHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const initials = user?.fullname
    ? user.fullname
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/groceries?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm shadow-purple-500/5">
      <div className="flex items-center gap-10">
        <Link href="/">
          <LeoMartLogo size={28} />
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <Link href="/groceries" className="hover:text-purple-600 transition">
            Groceries
          </Link>
          <Link href="/wholesale" className="hover:text-purple-600 transition">
            Bulk Orders
          </Link>
          <Link href="/blog" className="hover:text-purple-600 transition">
            Blog
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="hidden md:flex relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries..."
            className="w-56 border border-purple-100/80 bg-purple-50/20 pl-4 pr-9 py-2 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
          />
          <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-600">
            <Search size={14} />
          </button>
        </form>
        <Link href="/groceries" className="text-gray-600 hover:text-purple-600 transition relative p-1.5 hover:bg-purple-50 rounded-xl">
          <ShoppingCart size={22} />
        </Link>
        {!loading && user ? (
          <Link href="/dashboard" className="flex items-center gap-2.5 bg-purple-50/80 hover:bg-purple-100 border border-purple-100/60 rounded-full py-1.5 pl-1.5 pr-3 transition">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullname}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
                {initials || <User size={14} />}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-700 hidden md:inline max-w-[100px] truncate">
              {user.fullname || "Account"}
            </span>
          </Link>
        ) : (
          <Link href="/login" className="flex items-center gap-2 bg-purple-50/80 hover:bg-purple-100 border border-purple-100/60 rounded-full py-1.5 pl-1.5 pr-3 transition">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <User size={16} />
            </div>
            <span className="text-sm font-semibold text-gray-500 hidden md:inline">Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
