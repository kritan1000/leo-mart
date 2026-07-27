"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LeoMartLogo } from "../_components/type/AuthComponent";
import { resetPasswordAction } from "@/lib/actions/auth-action";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!token) {
      toast.error("No reset token found. Please request a new reset link.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }

    try {
      const res = await resetPasswordAction(token, data.newPassword);
      if (res.success) {
        setIsSuccess(true);
        toast.success(res.message || "Password has been reset successfully!");
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } else {
        toast.error(res.message || "Password reset failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFC] px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-purple-100/80 rounded-3xl shadow-xl shadow-purple-500/5 p-8 md:p-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-center mb-4">
            <LeoMartLogo size={32} />
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">Invalid Reset Link</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              This password reset link is invalid or missing a token.
              Please request a new reset link.
            </p>
            <div className="flex flex-col gap-3 w-full pt-4">
              <Link
                href="/forgot-password"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 transition text-center"
              >
                Request New Reset Link
              </Link>
              <Link
                href="/login"
                className="w-full text-center text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFC] px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-purple-100/80 rounded-3xl shadow-xl shadow-purple-500/5 p-8 md:p-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-center mb-4">
            <LeoMartLogo size={32} />
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">Password Reset Successfully</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your password has been updated. Redirecting to login...
            </p>
            <Link
              href="/login"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 transition text-center"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAFC] px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-purple-100/80 rounded-3xl shadow-xl shadow-purple-500/5 p-8 md:p-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-center mb-4">
          <LeoMartLogo size={32} />
        </div>

        <h1 className="text-center text-xl font-extrabold text-gray-900 mb-2">
          Reset your password
        </h1>
        <p className="text-center text-sm text-gray-500 mb-8 font-medium">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col space-y-1">
            <label htmlFor="newPassword" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                <Lock size={16} />
              </span>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
                autoComplete="new-password"
                className={`w-full border pl-10 pr-12 py-2.5 text-sm rounded-xl outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition ${
                  errors.newPassword ? "border-red-400" : "border-purple-100"
                }`}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-red-500 text-xs font-medium">{errors.newPassword.message}</span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                <Lock size={16} />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className={`w-full border pl-10 pr-12 py-2.5 text-sm rounded-xl outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition ${
                  errors.confirmPassword ? "border-red-400" : "border-purple-100"
                }`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs font-medium">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="flex flex-col items-center gap-3 mt-8 text-sm font-medium">
          <Link
            href="/login"
            className="text-purple-600 hover:text-purple-800 font-semibold transition inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
          <Link
            href="/forgot-password"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            Request another reset email
          </Link>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
          <Loader2 className="animate-spin text-purple-600" size={32} />
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
