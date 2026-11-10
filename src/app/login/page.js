"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crown, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

function LoginContent() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const reason = searchParams.get("reason");

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message || "No account found with this email. Please register first.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message || "Failed to sign in with Google. Please check your connection.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <Crown size={32} className={styles.logoIcon} />
          <span className={styles.logoText}>SHOE <span className="gold-text">KING</span></span>
        </div>

        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.sub}>Sign in to your Shoe King account</p>

        {/* Reason banner if redirected from shopping or checkout */}
        {reason === "shop" && (
          <div style={{
            background: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.3)",
            color: "var(--text)",
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 14,
            marginBottom: 16,
            textAlign: "center"
          }}>
            🔒 <strong>Sign In to Shop</strong> — Please sign in or create an account to browse and buy.
          </div>
        )}

        {reason === "checkout" && (
          <div style={{
            background: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.3)",
            color: "var(--text)",
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 14,
            marginBottom: 16,
            textAlign: "center"
          }}>
            🛍️ <strong>Checkout Requires Sign In</strong> — Please log in to complete your order.
          </div>
        )}

        {/* Social */}
        <div className={styles.socials}>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className={`btn btn-outline ${styles.socialBtn}`}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <img src="https://www.google.com/favicon.ico" width={16} alt="Google" />
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>
        </div>

        <div className={styles.dividerRow}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or sign in with email</span>
          <span className={styles.dividerLine} />
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            color: "#ef4444",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 14,
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            {error.toLowerCase().includes("no account found") && (
              <Link
                href="/register"
                className="btn btn-primary btn-sm"
                style={{ alignSelf: "flex-start", marginTop: 4 }}
              >
                Create Account Now →
              </Link>
            )}
          </div>
        )}

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrap}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className={styles.input}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Password</label>
              <Link href="#" className={styles.forgot}>Forgot password?</Link>
            </div>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={styles.input}
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in…" : <> Sign In <ArrowRight size={16} /> </>}
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className={styles.link}>Create one free →</Link>
        </p>
      </div>

      {/* Background decor */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px 0", textAlign: "center" }}>Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
