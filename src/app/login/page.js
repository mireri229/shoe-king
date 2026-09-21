"use client";
import { useState } from "react";
import Link from "next/link";
import { Crown, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

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

        {/* Social */}
        <div className={styles.socials}>
          <button className={`btn btn-outline ${styles.socialBtn}`}>
            <img src="https://www.google.com/favicon.ico" width={16} alt="Google" />
            Continue with Google
          </button>
          <button className={`btn btn-outline ${styles.socialBtn}`}>
            <img src="https://www.apple.com/favicon.ico" width={16} alt="Apple" />
            Continue with Apple
          </button>
        </div>

        <div className={styles.dividerRow}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or sign in with email</span>
          <span className={styles.dividerLine} />
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>
            Sign In <ArrowRight size={16} />
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
