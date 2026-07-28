"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Search } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";
import ThemeToggle from "./ThemeToggle";

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
    <header className="bg-white/80 dark:bg-[#0f0f14]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm shadow-purple-500/5 dark:shadow-purple-500/10">
      <div className="flex items-center gap-10">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <LeoMartLogo size={28} />
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-600 dark:text-gray-400">
          <Link
            href="/groceries"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group"
          >
            Groceries
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all group-hover:w-full rounded-full" />
          </Link>
          <Link
            href="/wholesale"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group"
          >
            Bulk Orders
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all group-hover:w-full rounded-full" />
          </Link>
          <Link
            href="/blog"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group"
          >
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all group-hover:w-full rounded-full" />
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="hidden md:flex relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries..."
            className="w-56 border border-purple-100/80 dark:border-purple-900/50 bg-purple-50/20 dark:bg-purple-950/30 pl-4 pr-9 py-2 rounded-xl text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400"
          >
            <Search size={14} />
          </button>
        </form>

        <ThemeToggle />

        <Link
          href="/groceries"
          className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative p-2 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl"
        >
          <ShoppingCart size={20} />
        </Link>

        {!loading && user ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 bg-purple-50/80 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-100/60 dark:border-purple-800/40 rounded-full py-1.5 pl-1.5 pr-3 transition-all hover:shadow-md hover:shadow-purple-500/10"
          >
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullname}
                className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800 shadow-sm">
                {initials || <User size={14} />}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:inline max-w-[100px] truncate">
              {user.fullname || "Account"}
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full py-1.5 pl-1.5 pr-3 transition-all shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm font-semibold hidden md:inline">Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
