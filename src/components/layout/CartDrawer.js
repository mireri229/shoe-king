"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQty, total, count } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => setIsOpen(false)} />
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ShoppingBag size={20} className={styles.headerIcon} />
            <h2 className={styles.title}>Your Cart</h2>
            {count > 0 && <span className={styles.count}>{count}</span>}
          </div>
          <button className="btn btn-icon btn-ghost" onClick={() => setIsOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Items */}
        {items.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={60} className={styles.emptyIcon} />
            <h3>Your cart is empty</h3>
            <p>Add some shoes to get started!</p>
            <Link href="/shop" className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.key} className={styles.item}>
                  <div className={styles.imgWrap}>
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="80px"
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <p className={styles.itemMeta}>
                      Size {item.size} · {item.colorNames?.[item.colorIndex] ?? item.color}
                    </p>
                    <div className={styles.itemBottom}>
                      <span className={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</span>
                      <div className={styles.qtyControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qty}>{item.qty}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(item.key, item.qty + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.key)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.divider} />
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span className={styles.subtotalAmt}>${total.toFixed(2)}</span>
              </div>
              <div className={styles.shipping}>
                <span>Shipping</span>
                <span className="gold-text">Free</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmt}>${total.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className={`btn btn-primary ${styles.checkoutBtn}`} onClick={() => setIsOpen(false)}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <button
                className={`btn btn-ghost ${styles.continueBtn}`}
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
