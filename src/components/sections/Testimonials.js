import { Star, Quote } from "lucide-react";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    name: "Marcus Chen",
    role: "Fashion Designer",
    avatar: "MC",
    rating: 5,
    text: "Shoe King has completely ruined other shoe brands for me. The craftsmanship on my Crown Oxford pair is absolutely unreal. Worth every single penny.",
    product: "Crown Classic Oxford",
  },
  {
    name: "Aisha Williams",
    role: "Marketing Director",
    avatar: "AW",
    rating: 5,
    text: "I bought the Empress Heels for a gala event and received compliments the entire night. They are stunning AND comfortable — a miracle combination.",
    product: "Empress Heel Luxe",
  },
  {
    name: "Jordan Torres",
    role: "Personal Trainer",
    avatar: "JT",
    rating: 5,
    text: "The Velocity Pro X is the best running shoe I have ever owned. The HyperFoam technology is no joke — my knees have never felt better on long runs.",
    product: "Velocity Pro X",
  },
  {
    name: "Sophie Laurent",
    role: "Photographer",
    avatar: "SL",
    rating: 5,
    text: "Fast shipping, beautiful packaging, and the shoes are exactly as described. The Air Monarch Elite is my everyday go-to now. Shoe King for life!",
    product: "Air Monarch Elite",
  },
];

export default function Testimonials() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Customer Reviews</p>
          <h2 className="section-title">
            What Our <span className="gold-gradient-text">Royals</span> Say
          </h2>
        </div>

        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.name} className={styles.card}>
              <Quote size={32} className={styles.quote} />
              <p className={styles.text}>&ldquo;{t.text}&rdquo;</p>
              <p className={styles.product}>On: {t.product}</p>
              <div className={styles.footer}>
                <div className={styles.avatar}>{t.avatar}</div>
                <div className={styles.authorInfo}>
                  <span className={styles.name}>{t.name}</span>
                  <span className={styles.role}>{t.role}</span>
                </div>
                <div className={styles.stars}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
