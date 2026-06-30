"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData, loginSchema } from "../../_components/schema";
import { LeoMartLogo } from "../../_components/type/AuthComponent";
import { loginUser } from "@/lib/actions/auth-action";

export default function LoginFormZod() {
  const router = useRouter();
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
      // loginUser is a server action — it sets auth_token cookie server-side
      const res = await loginUser(data);
      if (res.success) {
        // refresh so Next.js picks up the new cookie, then navigate
        router.refresh();
        const role = res.data?.user?.role;
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMsg(res.message || "Invalid email or password");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-md shadow-sm p-8">
        <div className="flex justify-center mb-3">
          <LeoMartLogo size={24} />
        </div>

        <p className="text-center text-sm text-gray-500 mb-8">
          Sign in to your account to continue
        </p>

        {errorMsg && (
          <div className="bg-red-50 text-red-500 border border-red-200 text-xs px-3 py-2 rounded-sm mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder=""
              autoComplete="email"
              className={`w-full border px-3 py-2 text-sm rounded-sm outline-none text-black focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email")}
            />

            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>

              <button type="button" className="text-xs text-indigo-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=""
                autoComplete="current-password"
                className={`w-full border px-3 py-2 text-sm rounded-sm outline-none text-black focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2.5 rounded-sm text-sm font-medium transition duration-200"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/Register" className="text-indigo-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
