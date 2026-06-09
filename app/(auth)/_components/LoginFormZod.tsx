"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "./schema";

export default function LoginFormZod() {
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

  const onSubmit = (data: LoginFormData) => {
    alert("Submitted data: " + data.email + ", " + data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          EMAIL ADDRESS
        </label>

        <input
          type="email"
          placeholder="name@example.com"
          {...register("email")}
          className="
            w-full
            border
            border-gray-300
            rounded-xl
            px-4
            py-3
            bg-white
            text-black
            placeholder:text-gray-400
            outline-none
            transition
            focus:ring-2
            focus:ring-[#5B4DFF]
            focus:border-[#5B4DFF]
          "
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">
            PASSWORD
          </label>

          <button
            type="button"
            className="text-sm text-[#5B4DFF] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <input
          type="password"
          placeholder="********"
          {...register("password")}
          className="
            w-full
            border
            border-gray-300
            rounded-xl
            px-4
            py-3
            bg-white
            text-black
            placeholder:text-gray-400
            outline-none
            transition
            focus:ring-2
            focus:ring-[#5B4DFF]
            focus:border-[#5B4DFF]
          "
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full
          bg-[#5B4DFF]
          text-white
          py-3
          rounded-xl
          font-semibold
          hover:opacity-90
          transition
          disabled:opacity-50
        "
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
