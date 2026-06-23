"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  clearAuthCookies,
  getTokenCookie,
  getUserInfoCookie,
  setUserInfoCookie,
} from "../cookies";
import { useRouter } from "next/navigation";
import { getWhoAmI } from "../api/auth";

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const checkAuth = async () => {
    try {
      const token = await getTokenCookie();
      if (token) {
        const res = await getWhoAmI();
        if (res.success && res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
          await setUserInfoCookie(res.data);
        } else {
          await clearAuthCookies();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      await clearAuthCookies();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await clearAuthCookies();
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        logout,
        loading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
