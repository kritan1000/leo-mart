"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LeoMartLogo } from "../_components/type/AuthComponent";
import { requestPasswordResetAction } from "@/lib/actions/auth-action";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const res = await requestPasswordResetAction(data.email);
      if (res.success) {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
        toast.success(res.message || "Password reset link sent successfully.");
      } else {
        toast.error(res.message || "Failed to send password reset email.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  if (isSubmitted) {
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
            <h1 className="text-xl font-extrabold text-gray-900">Check your email</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-semibold text-gray-700">{submittedEmail}</span>.
              Please check your inbox and follow the instructions.
            </p>
            <p className="text-xs text-gray-400">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <div className="flex flex-col gap-3 w-full pt-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSubmittedEmail("");
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 transition"
              >
                Try another email
              </button>
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAFC] px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-purple-100/80 rounded-3xl shadow-xl shadow-purple-500/5 p-8 md:p-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-center mb-4">
          <LeoMartLogo size={32} />
        </div>

        <h1 className="text-center text-xl font-extrabold text-gray-900 mb-2">
          Forgot your password?
        </h1>
        <p className="text-center text-sm text-gray-500 mb-8 font-medium">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full border pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition ${
                  errors.email ? "border-red-400" : "border-purple-100"
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs font-medium">{errors.email.message}</span>
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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
    </main>
  );
}
