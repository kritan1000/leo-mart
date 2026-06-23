import axios from "axios";
import { getTokenCookie } from "../cookies";

const BASE_URL = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = await getTokenCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
