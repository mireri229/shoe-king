import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import styles from "./NewArrivals.module.css";

export default function NewArrivals() {
  const featured = products.slice(0, 4);

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Just Dropped</p>
            <h2 className="section-title">
              New <span className="gold-gradient-text">Arrivals</span>
            </h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Fresh styles just landed. Be the first to step into the latest.
            </p>
          </div>
          <Link href="/shop" className="btn btn-outline">
            View All →
          </Link>
        </div>

        <div className={styles.grid}>
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
