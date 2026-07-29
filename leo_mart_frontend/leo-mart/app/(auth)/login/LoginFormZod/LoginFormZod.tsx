"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData, loginSchema } from "../../_components/schema";
import { LeoMartLogo } from "../../_components/type/AuthComponent";
import { loginUser } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginFormZod() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg("");
    try {
      const res = await loginUser(data);
      if (res.success) {
        await checkAuth();
        router.refresh();
        const role = res.data?.user?.role;
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        setErrorMsg(res.message || "Invalid email or password");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Login failed. Please try again.");
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
          Sign in to your account to continue
        </p>

        {errorMsg && (
          <div className="bg-red-50 text-red-500 border border-red-200 text-xs px-3 py-2.5 rounded-xl mb-4 text-center font-medium">
            {errorMsg}
          </div>
        )}

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

          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-purple-600 hover:text-purple-800 font-semibold transition"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                <Lock size={16} />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full border pl-10 pr-12 py-2.5 text-sm rounded-xl outline-none text-black focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition ${
                  errors.password ? "border-red-400" : "border-purple-100"
                }`}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <span className="text-red-500 text-xs font-medium">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/Register" className="text-purple-600 hover:text-purple-800 font-semibold transition">
            Sign up
          </Link>
        </p>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400">or</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-6 bg-white border border-purple-200 hover:border-purple-400 text-gray-700 py-3 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md active:scale-95 transition duration-200"
        >
          Continue as Guest
        </button>
      </div>
    </main>
  );
}
