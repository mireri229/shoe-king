"use client";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background */}
      <div className={styles.bg}>
        <div className={styles.bgGradient} />
        <div className={styles.bgImage} />
        <div className={styles.bgNoise} />
      </div>

      {/* Floating orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={`container ${styles.content}`}>
        <div className={styles.left}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Premium Footwear Collection 2024
          </div>

          <h1 className={styles.headline}>
            Walk Like<br />
            <span className="gold-gradient-text">Royalty</span><br />
            Every Day
          </h1>

          <p className={styles.sub}>
            Discover unparalleled craftsmanship and bold design. Shoe King redefines luxury
            footwear for those who refuse to compromise on style or comfort.
          </p>

          <div className={styles.ctas}>
            <Link href="/shop" className="btn btn-primary btn-lg">
              Shop Collection <ArrowRight size={18} />
            </Link>
            <button className={`btn btn-outline btn-lg ${styles.playBtn}`}>
              <Play size={16} fill="currentColor" />
              Our Story
            </button>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "200+", label: "Premium Styles" },
              { value: "4.9★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className={styles.right}>
          <div className={styles.shoeDisplay}>
            <div className={styles.shoeGlow} />
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=90"
              alt="Shoe King Premium Sneaker"
              className={styles.shoeImg}
            />
            {/* Floating Tags */}
            <div className={`${styles.tag} ${styles.tag1}`}>
              <span className={styles.tagLabel}>Air Monarch Elite</span>
              <span className={styles.tagPrice}>$189</span>
            </div>
            <div className={`${styles.tag} ${styles.tag2}`}>
              <span className={styles.tagLabel}>⭐ 4.8 · Best Seller</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className={styles.bottomFade} />
    </section>
  );
}
