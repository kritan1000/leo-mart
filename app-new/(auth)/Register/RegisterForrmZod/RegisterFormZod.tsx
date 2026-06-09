"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  RegisterFormData,
  registerSchema,
} from "../../_components/schema";

import { LeoMartLogo } from "../../_components/type/AuthComponent";

export default function RegisterFormZod() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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

  const onSubmit = (data: RegisterFormData) => {
    console.log(data);

    alert("Account Created");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">

      <div className="w-full max-w-md">

        
        <div className="flex flex-col items-center mb-8">

          
          <div className="w-14 h-14 bg-[#4F46E5] rounded-md flex items-center justify-center mb-4">
            <span className="text-white text-2xl">
              🛒
            </span>
          </div>

          
          <LeoMartLogo size={32} />

          
          <p className="text-sm text-gray-500 mt-2">
            Create your account
          </p>
        </div>

        
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            
            <div className="flex flex-col">

              <label className="text-sm text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder=""
                className={`w-full border px-3 py-2 rounded-sm text-sm outline-none text-black focus:ring-2 focus:ring-[#4F46E5] ${
                  errors.fullName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...register("fullName")}
              />

              {errors.fullName && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            
            <div className="flex flex-col">

              <label className="text-sm text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder=""
                className={`w-full border px-3 py-2 rounded-sm text-sm outline-none text-black focus:ring-2 focus:ring-[#4F46E5] ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...register("email")}
              />

              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            
            <div className="grid grid-cols-2 gap-4">

              
              <div className="flex flex-col">

                <label className="text-sm text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder=""
                    className={`w-full border px-3 py-2 rounded-sm text-sm outline-none text-black focus:ring-2 focus:ring-[#4F46E5] ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              
              <div className="flex flex-col">

                <label className="text-sm text-gray-700 mb-2">
                  Confirm
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder=""
                    className={`w-full border px-3 py-2 rounded-sm text-sm outline-none text-black focus:ring-2 focus:ring-[#4F46E5] ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register(
                      "confirmPassword"
                    )}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <span className="text-red-500 text-xs mt-1">
                    {
                      errors.confirmPassword
                        .message
                    }
                  </span>
                )}
              </div>
            </div>

            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2.5 rounded-sm text-sm font-medium transition"
            >
              {isSubmitting
                ? "Creating Account..."
                : "Create Account →"}
            </button>
          </form>

          
          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}

            <Link
              href="/login"
              className="text-[#4F46E5] font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}