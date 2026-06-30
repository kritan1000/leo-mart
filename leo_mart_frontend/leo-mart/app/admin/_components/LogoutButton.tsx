"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-medium transition cursor-pointer"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}
