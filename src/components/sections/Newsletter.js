"use client";
import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="section">
      <div className="container">
        <div className={styles.card}>
          {/* Glow */}
          <div className={styles.glow} />

          <div className={styles.content}>
            <div className={styles.iconWrap}>
              <Mail size={28} />
            </div>
            <h2 className={styles.title}>
              Join the <span className="gold-gradient-text">Royal Court</span>
            </h2>
            <p className={styles.sub}>
              Subscribe to our newsletter for exclusive drops, member-only deals,
              and first access to new collections. No spam, ever.
            </p>

            {submitted ? (
              <div className={styles.success}>
                <CheckCircle size={24} className={styles.successIcon} />
                <span>Welcome to the Royal Court! Check your inbox.</span>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputWrap}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Subscribe <ArrowRight size={16} />
                </button>
              </form>
            )}

            <p className={styles.note}>
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>

            {/* Perks */}
            <div className={styles.perks}>
              {["10% off your first order", "Early access to sales", "Exclusive member drops"].map((p) => (
                <span key={p} className={styles.perk}>
                  <CheckCircle size={14} /> {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
