"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ui/ProductCard";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, ShoppingBag, Star, Shield, Truck, RefreshCw,
  ChevronRight, Minus, Plus, Check
} from "lucide-react";
import styles from "./page.module.css";

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find((p) => p.id === Number(params.id));

  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Product Not Found</h1>
        <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart(product, selectedSize, product.colorNames[selectedColor], qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop">Shop</Link>
          <ChevronRight size={14} />
          <Link href={`/shop?category=${product.category}`}>{product.category}</Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </nav>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImg}>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {discount && (
                <span className={`${styles.discountBadge} badge badge-sale`}>-{discount}%</span>
              )}
              {product.isNew && (
                <span className={`${styles.newBadge} badge badge-new`}>New</span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.info}>
            <div className={styles.meta}>
              <span className={styles.brand}>{product.brand}</span>
              <span className={styles.category}>{product.category} · {product.gender}</span>
            </div>

            <h1 className={styles.name}>{product.name}</h1>

            {/* Rating */}
            <div className={styles.rating}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className={styles.ratingVal}>{product.rating}</span>
              <span className={styles.reviewCount}>({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>${product.price}</span>
              {product.originalPrice > product.price && (
                <span className={styles.originalPrice}>${product.originalPrice}</span>
              )}
              {discount && (
                <span className="badge badge-sale">Save {discount}%</span>
              )}
            </div>

            <div className={styles.divider} />

            {/* Color Selector */}
            <div className={styles.selectorGroup}>
              <h3 className={styles.selectorLabel}>
                Color: <span className="gold-text">{product.colorNames[selectedColor]}</span>
              </h3>
              <div className={styles.colors}>
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    className={`${styles.colorBtn} ${selectedColor === i ? styles.colorBtnActive : ""}`}
                    style={{ background: color, border: color === "#ffffff" ? "1px solid rgba(255,255,255,0.2)" : "none" }}
                    onClick={() => setSelectedColor(i)}
                    title={product.colorNames[i]}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className={styles.selectorGroup}>
              <div className={styles.selectorLabelRow}>
                <h3 className={`${styles.selectorLabel} ${sizeError ? styles.sizeError : ""}`}>
                  {sizeError ? "⚠️ Please select a size" : `Size (EU): ${selectedSize || "—"}`}
                </h3>
                <button className={styles.sizeGuide}>Size Guide</button>
              </div>
              <div className={styles.sizes}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ""}`}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.divider} />

            {/* Qty + Add to Cart */}
            <div className={styles.addRow}>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>
                  <Minus size={14} />
                </button>
                <span className={styles.qtyVal}>{qty}</span>
                <button className={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>
                  <Plus size={14} />
                </button>
              </div>
              <button
                className={`btn btn-primary ${styles.addBtn} ${added ? styles.addedBtn : ""}`}
                onClick={handleAddToCart}
              >
                {added ? (
                  <><Check size={16} /> Added to Cart!</>
                ) : (
                  <><ShoppingBag size={16} /> Add to Cart</>
                )}
              </button>
              <button
                className={`btn btn-icon btn-outline ${wishlisted ? styles.wishlisted : ""}`}
                onClick={() => toggle(product)}
                aria-label="Wishlist"
              >
                <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Trust Signals */}
            <div className={styles.trust}>
              <div className={styles.trustItem}><Truck size={15} /> Free Shipping over $100</div>
              <div className={styles.trustItem}><RefreshCw size={15} /> 30-Day Returns</div>
              <div className={styles.trustItem}><Shield size={15} /> 2-Year Warranty</div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {["description", "features", "reviews"].map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles.tabContent}>
              {activeTab === "description" && (
                <p className={styles.description}>{product.description}</p>
              )}
              {activeTab === "features" && (
                <ul className={styles.featureList}>
                  {product.features.map((f) => (
                    <li key={f} className={styles.featureItem}>
                      <Check size={14} className={styles.featureCheck} />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "reviews" && (
                <div className={styles.reviewsTab}>
                  <div className={styles.ratingBig}>
                    <span className={styles.ratingBigNum}>{product.rating}</span>
                    <div>
                      <div className={styles.stars} style={{ fontSize: 20, gap: 4 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={20} fill="currentColor" />
                        ))}
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                        Based on {product.reviews} reviews
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className={styles.related}>
            <h2 className={styles.relatedTitle}>
              You Might Also <span className="gold-gradient-text">Like</span>
            </h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
