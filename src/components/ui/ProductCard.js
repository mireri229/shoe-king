"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, product.sizes[4] ?? product.sizes[0], product.colorNames[0], 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product);
  };

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link href={`/product/${product.id}`} className={styles.card}>
      {/* Image */}
      <div className={styles.imgWrap}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={styles.img}
        />

        {/* Badges */}
        <div className={styles.badges}>
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.isSale && discount && (
            <span className="badge badge-sale">-{discount}%</span>
          )}
          {product.badge && !product.isNew && !product.isSale && (
            <span className="badge badge-gold">{product.badge}</span>
          )}
        </div>

        {/* Overlay Actions */}
        <div className={styles.overlay}>
          <button
            className={`${styles.actionBtn} ${wishlisted ? styles.wishlisted : ""}`}
            onClick={handleWishlist}
            aria-label="Wishlist"
          >
            <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
          </button>
          <Link
            href={`/product/${product.id}`}
            className={styles.actionBtn}
            aria-label="Quick view"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Quick Add */}
        <button
          className={`${styles.quickAdd} ${added ? styles.added : ""}`}
          onClick={handleAddToCart}
        >
          <ShoppingBag size={15} />
          {added ? "Added!" : "Quick Add"}
        </button>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.meta}>
          <span className={styles.category}>{product.category}</span>
          <div className={styles.rating}>
            <Star size={12} fill="currentColor" />
            <span>{product.rating}</span>
            <span className={styles.reviews}>({product.reviews})</span>
          </div>
        </div>
        <h3 className={styles.name}>{product.name}</h3>

        {/* Color Dots */}
        <div className={styles.colors}>
          {product.colors.slice(0, 4).map((c, i) => (
            <span
              key={i}
              className={styles.colorDot}
              style={{ background: c, border: c === "#ffffff" ? "1px solid rgba(255,255,255,0.2)" : "none" }}
              title={product.colorNames[i]}
            />
          ))}
          {product.colors.length > 4 && (
            <span className={styles.moreColors}>+{product.colors.length - 4}</span>
          )}
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price}</span>
          {product.originalPrice > product.price && (
            <span className={styles.originalPrice}>${product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
