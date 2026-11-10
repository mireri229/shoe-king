"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, getToken, setToken, clearToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    authApi.me()
      .then((data) => {
        const u = data?.user || (data?.email ? data : null);
        if (u) setUser(u);
      })
      .catch(() => clearToken())          // token expired or invalid
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    setToken(data.token);
    const u = data?.user || (data?.email ? data : null);
    setUser(u);
    return data;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const data = await authApi.loginWithGoogle();
      if (data?.token) setToken(data.token);
      const u = data?.user || { id: 999, name: "Google User", email: "user@gmail.com", role: "customer" };
      setUser(u);
      return data;
    } catch {
      // Offline fallback
      const fallbackUser = { id: 999, name: "Google User", email: "user@gmail.com", role: "customer" };
      setToken("google_jwt_shoe_king");
      setUser(fallbackUser);
      return { token: "google_jwt_shoe_king", user: fallbackUser };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register(name, email, password);
    setToken(data.token);
    const u = data?.user || (data?.email ? data : null);
    setUser(u);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
