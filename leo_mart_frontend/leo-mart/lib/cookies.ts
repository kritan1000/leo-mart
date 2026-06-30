"use server";
import { cookies } from "next/headers";

export const setTokenCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: false,   // Must be false so client JS (axios + AuthContext) can read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
};

export const getTokenCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value || null;
};

export const setUserInfoCookie = async (userInfo: any) => {
  const cookieStore = await cookies();
  cookieStore.set("user_data", JSON.stringify(userInfo), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const getUserInfoCookie = async () => {
  const cookieStore = await cookies();
  const userInfoStr = cookieStore.get("user_data")?.value || null;
  return userInfoStr ? JSON.parse(userInfoStr) : null;
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_data");
};
