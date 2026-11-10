"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, AlertCircle } from "lucide-react";
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
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleSignUp = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push("/account");
    } catch (err) {
      setError(err.message || "Google sign-up failed. Please try again.");
    } finally {
      setGoogleLoading(false);
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
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className={`btn btn-outline ${styles.socialBtn}`}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <img src="https://www.google.com/favicon.ico" width={16} alt="Google" />
              {googleLoading ? "Connecting to Google..." : "Sign up with Google"}
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

      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
    </div>
  );
}
