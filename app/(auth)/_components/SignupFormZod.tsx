"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "./schema";

export default function RegisterFormZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    alert(
      `Submitted data:
${data.fullname}
${data.email}
${data.password}`,
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          FULL NAME
        </label>

        <input
          type="text"
          placeholder="Enter your full name"
          {...register("fullname")}
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

        {errors.fullname && (
          <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          EMAIL ADDRESS
        </label>

        <input
          type="email"
          placeholder="Enter your email"
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          PASSWORD
        </label>

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

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          CONFIRM PASSWORD
        </label>

        <input
          type="password"
          placeholder="********"
          {...register("confirmPassword")}
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

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
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
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
