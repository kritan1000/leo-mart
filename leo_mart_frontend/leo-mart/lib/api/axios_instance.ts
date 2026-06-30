import axios from "axios";

const BASE_URL = "";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Read auth_token from browser cookie (client-side safe)
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
