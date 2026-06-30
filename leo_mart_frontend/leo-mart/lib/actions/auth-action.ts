"use server";
import {
  LoginFormData,
  RegisterFormData,
} from "@/app/(auth)/_components/schema";
import { setTokenCookie, setUserInfoCookie } from "../cookies";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function registerUser(data: RegisterFormData) {
  try {
    const payload = {
      fullname: data.fullName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message || "Registration successful",
      };
    }
    return { success: false, message: result.message || "Registration failed" };
  } catch (error: any) {
    return { success: false, message: error.message || "Registration failed" };
  }
}

export async function loginUser(data: LoginFormData) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password }),
    });

    const result = await res.json();

    if (result.success) {
      const user = result.data?.user;
      const token = result.data?.token;
      await setUserInfoCookie(user);
      await setTokenCookie(token);

      return {
        success: true,
        data: result.data,
        message: result.message || "Login successful",
      };
    }
    return { success: false, message: result.message || "Login failed" };
  } catch (error: any) {
    return { success: false, message: error.message || "Login failed" };
  }
}
