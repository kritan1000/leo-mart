"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Shield } from "lucide-react";
import { createUserAction } from "@/lib/actions/user-action";
import { LeoMartLogo } from "../../../(auth)/_components/type/AuthComponent";

export default function CreateUserPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullname.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Full Name, Email and Password are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createUserAction({
        fullname,
        email,
        username: username.trim() || undefined,
        role,
        password,
      });

      if (res.success) {
        setSuccessMsg("User created successfully!");
        setTimeout(() => {
          router.push("/admin/dashboard");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(res.message || "Failed to create user");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span className="text-purple-600 font-semibold">Create User</span>
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
            <UserPlus size={24} />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Create New User
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Register a new administrator or customer account.
          </p>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-500/5 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-2.5 rounded-lg text-center font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-2.5 rounded-lg text-center font-medium">
                {successMsg}
              </div>
            )}

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Username (optional)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. johndoe12"
                className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. johndoe@gmail.com"
                className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              >
                <option value="user">User / Customer</option>
                <option value="admin">Administrator</option>
              </select>
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
                {isSubmitting ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
