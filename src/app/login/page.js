"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crown, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, X, Check } from "lucide-react";
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

  // Google modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");

  const suggestedGoogleAccounts = [
    { name: "Personal Account", email: "user.personal@gmail.com" },
    { name: "Shoe King VIP", email: "james.k@gmail.com" },
  ];

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

  const handleSelectGoogleAccount = async (selectedEmail, selectedName) => {
    setError("");
    setLoading(true);
    setShowGoogleModal(false);
    try {
      await loginWithGoogle({
        email: selectedEmail,
        name: selectedName || selectedEmail.split("@")[0],
      });
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
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
            onClick={() => setShowGoogleModal(true)}
            className={`btn btn-outline ${styles.socialBtn}`}
          >
            <img src="https://www.google.com/favicon.ico" width={16} alt="Google" />
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleSelectGoogleAccount("apple.user@icloud.com", "Apple User")}
            className={`btn btn-outline ${styles.socialBtn}`}
          >
            <img src="https://www.apple.com/favicon.ico" width={16} alt="Apple" />
            Continue with Apple
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

      {/* Google Account Picker Modal */}
      {showGoogleModal && (
        <>
          <div className="overlay" onClick={() => setShowGoogleModal(false)} />
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 28,
            width: "90%",
            maxWidth: 420,
            zIndex: 1000,
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src="https://www.google.com/favicon.ico" width={20} alt="Google" />
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Sign in with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="btn btn-icon btn-ghost"
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>
              Choose an existing Google email or enter a new one to sign in to Shoe King:
            </p>

            {/* List of accounts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {suggestedGoogleAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectGoogleAccount(acc.email, acc.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--text)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{acc.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{acc.email}</div>
                  </div>
                  <Check size={16} color="var(--gold-400)" />
                </button>
              ))}
            </div>

            {/* Custom Google Email Input */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>
                Or enter your Google Email:
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  className="input"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (customGoogleEmail && customGoogleEmail.includes("@")) {
                      handleSelectGoogleAccount(customGoogleEmail);
                    }
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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
