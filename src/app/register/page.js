"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, AlertCircle, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "../login/page.module.css";
import regStyles from "./page.module.css";

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Modal State
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
      await register(form.name, form.email, form.password);
      router.push("/account");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGoogleAccount = async (selectedEmail, selectedName) => {
    setError("");
    setLoading(true);
    setShowGoogleModal(false);
    try {
      if (loginWithGoogle) {
        await loginWithGoogle({
          email: selectedEmail,
          name: selectedName || selectedEmail.split("@")[0],
        });
      }
      router.push("/account");
    } catch (err) {
      setError(err.message || "Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    "Exclusive member discounts",
    "Early access to new drops",
    "Free shipping on all orders",
    "Earn loyalty reward points",
  ];

  return (
    <div className={`${styles.page} ${regStyles.page}`}>
      <div className={regStyles.layout}>
        {/* Left: Perks */}
        <div className={regStyles.leftPanel}>
          <Crown size={36} className={regStyles.icon} />
          <h2 className={regStyles.panelTitle}>Join the Royalty</h2>
          <p className={regStyles.panelSub}>Create your Shoe King account and unlock a world of exclusive benefits.</p>
          <ul className={regStyles.perks}>
            {perks.map((p) => (
              <li key={p} className={regStyles.perk}>
                <Check size={16} className={regStyles.perkCheck} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Form */}
        <div className={styles.card} style={{ maxWidth: "100%" }}>
          <div className={styles.logoWrap}>
            <Crown size={28} className={styles.logoIcon} />
            <span className={styles.logoText}>SHOE <span className="gold-text">KING</span></span>
          </div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.sub}>Start your premium journey today</p>

          {/* Social signup */}
          <div className={styles.socials} style={{ marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className={`btn btn-outline ${styles.socialBtn}`}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <img src="https://www.google.com/favicon.ico" width={16} alt="Google" />
              Sign up with Google
            </button>
          </div>

          <div className={styles.dividerRow}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or register with email</span>
            <span className={styles.dividerLine} />
          </div>

          {/* Error message */}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#ef4444",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 12 }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Full Name</label>
              <div className={styles.inputWrap}>
                <User size={16} className={styles.inputIcon} />
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className={styles.input}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  className={styles.input}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 4, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating account…" : <> Create Account <ArrowRight size={16} /> </>}
            </button>
          </form>

          <p className={styles.footer}>
            Already have an account?{" "}
            <Link href="/login" className={styles.link}>Sign in →</Link>
          </p>

          <p className={regStyles.terms}>
            By creating an account, you agree to our{" "}
            <Link href="#">Terms of Service</Link> and{" "}
            <Link href="#">Privacy Policy</Link>.
          </p>
        </div>
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
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Sign up with Google</h3>
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
              Choose a Google email or enter a new one to register with Shoe King:
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

      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
    </div>
  );
}
