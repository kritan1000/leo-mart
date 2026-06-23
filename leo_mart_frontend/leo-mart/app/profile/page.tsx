"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { updateProfile } from "@/lib/api/auth";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";
import { User, Lock, Mail, Camera, ArrowLeft, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logout, loading, checkAuth } = useAuth();
  const router = useRouter();

  // Profile fields state
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Password fields state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Initialize fields once user is loaded
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setFullname(user.fullname || "");
      setEmail(user.email || "");
      if (user.profilePicture) {
        setProfilePreview(user.profilePicture);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-gray-500 text-sm animate-pulse">Loading profile details...</div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
        setProfileMsg({ text: "Profile updated successfully!", type: "success" });
        await checkAuth(); // Sync user state
      } else {
        setProfileMsg({ text: res.message || "Failed to update profile", type: "error" });
      }
    } catch (err: any) {
      setProfileMsg({ text: err.message || "An error occurred", type: "error" });
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
      setPasswordMsg({ text: "Password must be at least 6 characters long", type: "error" });
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
        setPasswordMsg({ text: "Password updated successfully!", type: "success" });
        setPassword("");
        setConfirmPassword("");
        await checkAuth(); // Sync state
      } else {
        setPasswordMsg({ text: res.message || "Failed to update password", type: "error" });
      }
    } catch (err: any) {
      setPasswordMsg({ text: err.message || "An error occurred", type: "error" });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col text-black font-sans">
      {/* Top Header/Nav */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <LeoMartLogo size={24} />
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link href="/dashboard" className="hover:text-[#4F46E5] transition">
              Dashboard
            </Link>
            <Link href="/profile" className="text-[#4F46E5] font-semibold">
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

      {/* Main container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
            <p className="text-sm text-gray-500">Update your profile details and security settings</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-sm text-indigo-600 hover:underline font-medium"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Profile Update */}
          <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              Profile Details
            </h2>

            {profileMsg.text && (
              <div
                className={`text-xs px-3 py-2 rounded-sm mb-4 border text-center ${
                  profileMsg.type === "success"
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-red-50 text-red-500 border-red-200"
                }`}
              >
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {/* Profile Photo Uploader */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center relative">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-3xl font-bold">
                        {fullname ? fullname.charAt(0).toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-[#4F46E5] text-white p-2 rounded-full cursor-pointer hover:bg-[#4338CA] transition shadow-md"
                  >
                    <Camera size={14} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-xs text-gray-500 mt-2">Click icon to upload photo</span>
              </div>

              {/* Full Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-sm text-sm outline-none text-black focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-sm text-sm outline-none text-black focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    placeholder="Your Email"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2 rounded-sm text-sm font-medium transition cursor-pointer disabled:opacity-50"
              >
                {isSavingProfile ? "Saving changes..." : "Save Profile Details"}
              </button>
            </form>
          </div>

          {/* Column 2: Password Update */}
          <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              Update Password
            </h2>

            {passwordMsg.text && (
              <div
                className={`text-xs px-3 py-2 rounded-sm mb-4 border text-center ${
                  passwordMsg.type === "success"
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-red-50 text-red-500 border-red-200"
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {/* New Password */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-sm text-sm outline-none text-black focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-sm text-sm outline-none text-black focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    placeholder="Verify new password"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2 rounded-sm text-sm font-medium transition cursor-pointer disabled:opacity-50"
              >
                {isSavingPassword ? "Updating password..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
