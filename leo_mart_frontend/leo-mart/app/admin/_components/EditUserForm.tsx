"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateUserAction } from "@/lib/actions/user-action";

interface EditUserFormProps {
  user: {
    _id: string;
    fullname: string;
    email: string;
    username?: string;
    role: string;
  };
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const [fullname, setFullname] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username || "");
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullname.trim() || !email.trim()) {
      setErrorMsg("Full Name and Email are required");
      return;
    }

    setIsSubmitting(true);

    const updateData: any = {
      fullname,
      email,
      username: username.trim() || undefined,
      role,
    };

    if (password.trim()) {
      updateData.password = password;
    }

    try {
      const res = await updateUserAction(user._id, updateData);

      if (res.success) {
        setSuccessMsg("User updated successfully!");
        setTimeout(() => {
          router.push("/admin/dashboard");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(res.message || "Failed to update user");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            placeholder="Full Name"
            className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
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
            placeholder="Email Address"
            className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Password (leave blank to keep unchanged)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password to reset"
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
            {isSubmitting ? "Updating..." : "Update User"}
          </button>
        </div>
      </form>
    </div>
  );
}
