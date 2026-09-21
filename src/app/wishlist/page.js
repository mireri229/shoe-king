"use client";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <div className={styles.titleRow}>
            <Heart size={28} className={styles.headerIcon} />
            <div>
              <h1 className={styles.title}>My <span className="gold-gradient-text">Wishlist</span></h1>
              <p className={styles.sub}>{items.length} saved {items.length === 1 ? "item" : "items"}</p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <Heart size={72} className={styles.emptyIcon} />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love and come back to them anytime.</p>
            <Link href="/shop" className="btn btn-primary btn-lg">
              Discover Shoes <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((product) => (
              <div key={product.id} className={styles.card}>
                <Link href={`/product/${product.id}`} className={styles.imgWrap}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="300px"
                  />
                </Link>
                <div className={styles.info}>
                  <div className={styles.infoTop}>
                    <span className={styles.category}>{product.category}</span>
                    <button
                      className={styles.removeBtn}
                      onClick={() => remove(product.id)}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <Link href={`/product/${product.id}`} className={styles.name}>
                    {product.name}
                  </Link>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className={styles.originalPrice}>${product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => {
                      addToCart(product, product.sizes[4] ?? product.sizes[0], product.colorNames[0], 1);
                      remove(product.id);
                    }}
                  >
                    <ShoppingBag size={15} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
