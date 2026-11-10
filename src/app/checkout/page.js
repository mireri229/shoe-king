"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ordersApi } from "@/lib/api";
import {
  CreditCard, ShieldCheck, Truck, CheckCircle, ArrowLeft,
  Crown, AlertCircle, ShoppingBag, Lock
} from "lucide-react";
import styles from "./page.module.css";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please sign in to place your order.");
      router.push("/login?redirect=/checkout&reason=checkout");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map((i) => ({
        product_id: i.id,
        name: i.name,
        qty: i.qty,
        size: i.size,
        color: i.color,
        price: i.price,
      }));

      const res = await ordersApi.place(orderItems, form);
      clearCart();
      setSuccessOrder(res.orderId || "#SK-" + Math.floor(1000 + Math.random() * 9000));
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully placed
  if (successOrder) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ maxWidth: 640, textAlign: "center", padding: "80px 20px" }}>
          <div className={styles.successBadge}>
            <CheckCircle size={64} color="var(--gold-400)" />
          </div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "20px 0 10px" }}>
            Order Confirmed!
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: 24 }}>
            Thank you for shopping with Shoe King. Your order <span className="gold-text">{successOrder}</span> has been received and is being prepared.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <Link href="/account" className="btn btn-outline">
              View My Orders
            </Link>
            <Link href="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ maxWidth: 500, textAlign: "center", padding: "80px 20px" }}>
          <ShoppingBag size={56} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 12 }}>Your Cart is Empty</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
            Add some shoes to your cart before proceeding to checkout.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Browse Shoes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <Link href="/shop" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className={styles.title}>
            Secure <span className="gold-gradient-text">Checkout</span>
          </h1>
          <p className={styles.sub}>Complete your purchase with royal treatment.</p>
        </div>

        {/* Auth prompt if not logged in */}
        {!authLoading && !user && (
          <div className={styles.authNotice}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <AlertCircle size={20} color="var(--gold-400)" />
              <span>Already have an account? Sign in for faster checkout and loyalty rewards.</span>
            </div>
            <Link href="/login?redirect=/checkout" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className={styles.grid}>
          {/* Left Column: Form Fields */}
          <div className={styles.formCol}>
            {/* Contact Info */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>1. Contact Information</h2>
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="input"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="input"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ marginTop: 16 }}>
                <label className={styles.label}>Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="input"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>2. Shipping Address</h2>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Street Address</label>
                <input
                  name="address"
                  type="text"
                  required
                  placeholder="123 Crown Blvd, Apt 4B"
                  className="input"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.row} style={{ marginTop: 16 }}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>City</label>
                  <input
                    name="city"
                    type="text"
                    required
                    placeholder="New York"
                    className="input"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>State / Province</label>
                  <input
                    name="state"
                    type="text"
                    required
                    placeholder="NY"
                    className="input"
                    value={form.state}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>ZIP / Postal Code</label>
                  <input
                    name="zip"
                    type="text"
                    required
                    placeholder="10001"
                    className="input"
                    value={form.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>3. Payment Method</h2>
              <div className={styles.paymentOptions}>
                {[
                  { id: "card", label: "Credit / Debit Card", icon: <CreditCard size={18} /> },
                  { id: "cod", label: "Cash on Delivery", icon: <Truck size={18} /> },
                  { id: "apple", label: "Apple Pay / Google Pay", icon: <Lock size={18} /> },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`${styles.paymentOption} ${paymentMethod === m.id ? styles.paymentOptionActive : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                      className={styles.radio}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {m.icon}
                      <span style={{ fontWeight: 600 }}>{m.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div style={{ marginTop: 20 }}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Card Number</label>
                    <input
                      type="text"
                      placeholder="•••• •••• •••• ••••"
                      className="input"
                      defaultValue="4242 •••• •••• 4242"
                    />
                  </div>
                  <div className={styles.row} style={{ marginTop: 16 }}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Expiry</label>
                      <input type="text" placeholder="MM/YY" className="input" defaultValue="12/28" />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>CVC</label>
                      <input type="text" placeholder="CVC" className="input" defaultValue="123" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className={styles.summaryCol}>
            <div className={styles.card} style={{ position: "sticky", top: 100 }}>
              <h2 className={styles.cardTitle}>Order Summary ({count} items)</h2>

              {/* Items List */}
              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div key={item.key} className={styles.itemRow}>
                    <div className={styles.itemImgWrap}>
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="60px"
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemMeta}>
                        Size {item.size} · Qty {item.qty}
                      </p>
                    </div>
                    <span className={styles.itemPrice}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.divider} />

              {/* Breakdown */}
              <div className={styles.breakdownRow}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Shipping</span>
                <span className="gold-text">Free (Royal Express)</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Estimated Tax</span>
                <span>$0.00</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmt}>${total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
              >
                {loading ? "Processing Order..." : `Place Order · $${total.toFixed(2)}`}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, color: "var(--text-muted)", fontSize: 13 }}>
                <ShieldCheck size={16} color="var(--gold-400)" />
                <span>256-bit SSL encrypted checkout</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

