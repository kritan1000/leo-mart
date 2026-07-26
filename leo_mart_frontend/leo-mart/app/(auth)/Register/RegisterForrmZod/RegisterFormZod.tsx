"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterFormData, registerSchema } from "../../_components/schema";
import { LeoMartLogo } from "../../_components/type/AuthComponent";
import { registerUser } from "@/lib/actions/auth-action";

export default function RegisterFormZod() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await registerUser(data);
      if (res.success) {
        setSuccessMsg("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setErrorMsg(res.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAFC] px-4 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-purple-100/80 rounded-3xl shadow-xl shadow-purple-500/5 p-8 md:p-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-center mb-4">
          <LeoMartLogo size={32} />
        </div>

        <p className="text-center text-sm text-gray-500 mb-8 font-medium">
          Create your account to start shopping
        </p>

        {errorMsg && (
          <div className="bg-red-50 text-red-500 border border-red-200 text-xs px-3 py-2.5 rounded-xl mb-4 text-center font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-600 border border-green-200 text-xs px-3 py-2.5 rounded-xl mb-4 text-center font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                <User size={16} />
              </span>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full border pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition ${
                  errors.fullName ? "border-red-400" : "border-purple-100"
                }`}
                {...register("fullName")}
              />
            </div>
            {errors.fullName && (
              <span className="text-red-500 text-xs font-medium">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="name@company.com"
                className={`w-full border pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition ${
                  errors.email ? "border-red-400" : "border-purple-100"
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs font-medium">{errors.email.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full border pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition ${
                    errors.password ? "border-red-400" : "border-purple-100"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs font-medium">{errors.password.message}</span>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Confirm</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full border pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition ${
                    errors.confirmPassword ? "border-red-400" : "border-purple-100"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs font-medium">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => alert("Please contact administrator to reset your password.")}
              className="text-xs text-purple-600 hover:text-purple-800 font-semibold transition"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 hover:text-purple-800 font-semibold transition hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
