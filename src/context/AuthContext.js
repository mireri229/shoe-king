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

  /**
   * Google Sign-In:
   * 1. If NEXT_PUBLIC_GOOGLE_CLIENT_ID is configured, opens Google's official account picker popup.
   * 2. If not yet configured, prompts the user for their Google email so testing can proceed seamlessly.
   */
  const loginWithGoogle = useCallback((customPayload) => {
    return new Promise((resolve, reject) => {
      // If custom payload (e.g. email/name) was directly passed:
      if (customPayload?.email) {
        authApi.loginWithGoogle(customPayload)
          .then((data) => {
            if (data?.token) setToken(data.token);
            const u = data?.user || {
              id: 999,
              name: customPayload.name || customPayload.email.split("@")[0],
              email: customPayload.email,
              role: "customer"
            };
            setUser(u);
            resolve(data);
          })
          .catch(reject);
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      // Real Google Identity Services (GIS) flow
      if (
        clientId &&
        clientId !== "YOUR_GOOGLE_CLIENT_ID_HERE" &&
        typeof window !== "undefined" &&
        window.google?.accounts?.oauth2
      ) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: "email profile openid",
            callback: async (tokenResponse) => {
              if (tokenResponse.error) {
                reject(new Error(tokenResponse.error_description || tokenResponse.error));
                return;
              }

              try {
                const profileRes = await fetch(
                  "https://www.googleapis.com/oauth2/v3/userinfo",
                  { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );
                const profile = await profileRes.json();

                const data = await authApi.loginWithGoogle({
                  email: profile.email,
                  name: profile.name,
                  picture: profile.picture,
                  googleId: profile.sub,
                });

                if (data?.token) setToken(data.token);
                const u = data?.user || {
                  id: 999,
                  name: profile.name,
                  email: profile.email,
                  picture: profile.picture,
                  role: "customer",
                };
                setUser(u);
                resolve(data);
              } catch (err) {
                reject(err);
              }
            },
          });

          // Opens Google's account selection popup
          client.requestAccessToken({ prompt: "select_account" });
          return;
        } catch (err) {
          console.error("GIS initialization failed, falling back:", err);
        }
      }

      // Fallback if NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured yet
      if (typeof window !== "undefined") {
        const inputEmail = window.prompt(
          "Enter your Google Email address to sign in with Google:\n(To enable automatic Google account picker popup, set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local)",
          "user@gmail.com"
        );

        if (!inputEmail) {
          reject(new Error("Google sign-in was cancelled."));
          return;
        }

        authApi.loginWithGoogle({
          email: inputEmail,
          name: inputEmail.split("@")[0],
        })
          .then((data) => {
            if (data?.token) setToken(data.token);
            const u = data?.user || {
              id: 999,
              name: inputEmail.split("@")[0],
              email: inputEmail,
              role: "customer"
            };
            setUser(u);
            resolve(data);
          })
          .catch(reject);
      } else {
        reject(new Error("Window is not available."));
      }
    });
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
