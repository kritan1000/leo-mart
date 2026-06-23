"use server";
import {
  LoginFormData,
  RegisterFormData,
} from "@/app/(auth)/_components/schema";
import { login, register } from "../api/auth";
import { setTokenCookie, setUserInfoCookie } from "../cookies";

export async function registerUser(data: RegisterFormData) {
  try {
    const result = await register(data);
    // how to send data to component
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
    const result = await login(data);
    // how to send data to component
    if (result.success) {
      // cookie implementation
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
