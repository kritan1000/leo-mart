"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { updateProfile } from "@/lib/api/auth";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";
import {
  User,
  Lock,
  Mail,
  Camera,
  ArrowLeft,
  LogOut,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Star,
  Phone,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const { user, logout, loading, checkAuth, setUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setEmail(user.email || "");
      if (user.profilePicture) {
        setProfilePreview(user.profilePicture);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  if (!user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setProfileMsg({ text: "Image must be under 5MB", type: "error" });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg({ text: "", type: "" });

    if (!fullname.trim() || !email.trim()) {
      setProfileMsg({ text: "Full Name and Email are required", type: "error" });
      return;
    }

    setIsSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email);
      if (selectedFile) {
        formData.append("profilePhoto", selectedFile);
      }

      const res = await updateProfile(formData);
      if (res.success) {
        if (res.data) {
          setUser(res.data);
        }
        await checkAuth();
        toast.success("Profile updated successfully!");
        setSelectedFile(null);
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ text: "", type: "" });

    if (!password) {
      setPasswordMsg({ text: "Password is required", type: "error" });
      return;
    }
    if (password.length < 6) {
      setPasswordMsg({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setPasswordMsg({ text: "Passwords do not match", type: "error" });
      return;
    }

    setIsSavingPassword(true);
    try {
      const formData = new FormData();
      formData.append("password", password);

      const res = await updateProfile(formData);
      if (res.success) {
        toast.success("Password updated successfully!");
        setPassword("");
        setConfirmPassword("");
        await checkAuth();
      } else {
        toast.error(res.message || "Failed to update password");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const initials = fullname
    ? fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
      <header className="bg-white border-b border-purple-100 py-4 px-6 flex items-center justify-between shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <LeoMartLogo size={24} />
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-500">
            <Link href="/dashboard" className="hover:text-purple-600 transition">
              Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-purple-600 font-semibold">Profile</span>
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
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
            <p className="text-sm text-gray-400">Manage your account settings and preferences</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white border border-purple-100/60 rounded-3xl shadow-xl shadow-purple-500/5 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-purple-600">{initials}</span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-14 pb-6 px-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">{fullname || "User"}</h2>
                <p className="text-sm text-gray-400">{email}</p>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-bold">
                <Star size={14} />
                {user.loyaltyPoints || 0} Points
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-purple-50">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Role</p>
                <p className="text-sm font-bold text-gray-800 capitalize">{user.role || "User"}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Member Since</p>
                <p className="text-sm font-bold text-gray-800">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <p className="text-sm font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Update Form */}
          <div className="bg-white border border-purple-100/60 rounded-3xl shadow-xl shadow-purple-500/5 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-purple-50 pb-3">
              <User className="text-purple-600" size={18} />
              <h3 className="text-base font-bold text-gray-900">Profile Details</h3>
            </div>

            {profileMsg.text && (
              <div
                className={`text-xs px-4 py-2.5 rounded-xl text-center font-semibold ${
                  profileMsg.type === "success"
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-red-50 text-red-500 border border-red-200"
                }`}
              >
                {profileMsg.type === "success" && <CheckCircle2 size={14} className="inline mr-1.5 -mt-0.5" />}
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full border border-purple-100/80 bg-purple-50/10 pl-10 pr-4 py-2.5 rounded-xl text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-purple-100/80 bg-purple-50/10 pl-10 pr-4 py-2.5 rounded-xl text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-purple-500/10 active:scale-95 transition flex items-center justify-center gap-2"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>

          {/* Password Update Form */}
          <div className="bg-white border border-purple-100/60 rounded-3xl shadow-xl shadow-purple-500/5 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-purple-50 pb-3">
              <ShieldCheck className="text-purple-600" size={18} />
              <h3 className="text-base font-bold text-gray-900">Security</h3>
            </div>

            {passwordMsg.text && (
              <div
                className={`text-xs px-4 py-2.5 rounded-xl text-center font-semibold ${
                  passwordMsg.type === "success"
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-red-50 text-red-500 border border-red-200"
                }`}
              >
                {passwordMsg.type === "success" && <CheckCircle2 size={14} className="inline mr-1.5 -mt-0.5" />}
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={15} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-purple-100/80 bg-purple-50/10 pl-10 pr-4 py-2.5 rounded-xl text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={15} />
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-purple-100/80 bg-purple-50/10 pl-10 pr-4 py-2.5 rounded-xl text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                    placeholder="Verify new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-purple-500/10 active:scale-95 transition flex items-center justify-center gap-2"
              >
                {isSavingPassword ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
              <Link
                href="/forgot-password"
                className="block text-center text-xs text-purple-600 hover:text-purple-800 font-semibold transition mt-2"
              >
                Forgot your password? Reset it here
              </Link>
            </form>
          </div>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
    </div>
  );
}
