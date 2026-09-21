import { Shield, Truck, RefreshCw, Award, Headphones, Star } from "lucide-react";
import styles from "./WhyShoeKing.module.css";

const benefits = [
  {
    icon: <Award size={28} />,
    title: "Premium Quality",
    desc: "Every pair is crafted from the finest materials, hand-selected by our expert craftsmen to ensure unmatched quality.",
  },
  {
    icon: <Truck size={28} />,
    title: "Free Shipping",
    desc: "Enjoy complimentary express delivery on all orders over $100, delivered straight to your doorstep within 2–3 days.",
  },
  {
    icon: <RefreshCw size={28} />,
    title: "Easy Returns",
    desc: "Not happy? Return or exchange within 30 days — no questions asked. We make it effortless.",
  },
  {
    icon: <Shield size={28} />,
    title: "2-Year Warranty",
    desc: "All Shoe King footwear comes with a 2-year manufacturer warranty covering craftsmanship defects.",
  },
  {
    icon: <Headphones size={28} />,
    title: "24/7 Support",
    desc: "Our dedicated style experts are available round the clock to help you find the perfect pair.",
  },
  {
    icon: <Star size={28} />,
    title: "Loyalty Rewards",
    desc: "Earn points on every purchase. Redeem for exclusive discounts, early access, and members-only deals.",
  },
];

export default function WhyShoeKing() {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Why Choose Us</p>
          <h2 className="section-title">
            The <span className="gold-gradient-text">Shoe King</span> Promise
          </h2>
          <p className={styles.sub}>
            From the moment you browse to the day you slip them on, we are committed
            to delivering a luxury experience at every step.
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((b) => (
            <div key={b.title} className={styles.card}>
              <div className={styles.iconWrap}>
                {b.icon}
              </div>
              <h3 className={styles.title}>{b.title}</h3>
              <p className={styles.desc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
