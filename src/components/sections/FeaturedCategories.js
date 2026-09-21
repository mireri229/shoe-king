import Link from "next/link";
import styles from "./FeaturedCategories.module.css";

const categories = [
  {
    name: "Sneakers",
    count: "48 styles",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
    href: "/shop?category=Sneakers",
    color: "#1a1a2e",
  },
  {
    name: "Formal",
    count: "32 styles",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    href: "/shop?category=Formal",
    color: "#2d1a0e",
  },
  {
    name: "Boots",
    count: "27 styles",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
    href: "/shop?category=Boots",
    color: "#1a1a1a",
  },
  {
    name: "Women's Heels",
    count: "41 styles",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    href: "/shop?category=Heels",
    color: "#1a0d14",
  },
  {
    name: "Running",
    count: "19 styles",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    href: "/shop?category=Running",
    color: "#0d1a1a",
  },
  {
    name: "Slides",
    count: "15 styles",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80",
    href: "/shop?category=Slides",
    color: "#1a1400",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Browse By Style</p>
            <h2 className="section-title">
              Shop by <span className="gold-gradient-text">Category</span>
            </h2>
          </div>
          <Link href="/shop" className="btn btn-outline">
            View All →
          </Link>
        </div>

        <div className={styles.grid}>
          {/* Big featured card */}
          <Link href={categories[0].href} className={`${styles.card} ${styles.cardBig}`}>
            <img src={categories[0].image} alt={categories[0].name} className={styles.cardImg} />
            <div className={styles.cardOverlay} />
            <div className={styles.cardInfo}>
              <h3 className={styles.cardName}>{categories[0].name}</h3>
              <span className={styles.cardCount}>{categories[0].count}</span>
            </div>
          </Link>

          {/* Right grid */}
          <div className={styles.rightGrid}>
            {categories.slice(1).map((cat) => (
              <Link href={cat.href} key={cat.name} className={styles.card}>
                <img src={cat.image} alt={cat.name} className={styles.cardImg} />
                <div className={styles.cardOverlay} />
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardName}>{cat.name}</h3>
                  <span className={styles.cardCount}>{cat.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
