"use client";
import Link from "next/link";
import { Crown, Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.topGlow} />
      <div className="container">
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Crown size={22} className={styles.logoIcon} />
              <span>SHOE <span className="gold-text">KING</span></span>
            </Link>
            <p className={styles.tagline}>
              Redefining luxury footwear since 2010. Every step tells a story of craftsmanship, passion, and style.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="Instagram" className={styles.social}><Instagram size={18} /></a>
              <a href="#" aria-label="Twitter" className={styles.social}><Twitter size={18} /></a>
              <a href="#" aria-label="Facebook" className={styles.social}><Facebook size={18} /></a>
              <a href="#" aria-label="YouTube" className={styles.social}><Youtube size={18} /></a>
            </div>
          </div>

          {/* Shop Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Shop</h4>
            <ul className={styles.colLinks}>
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/shop?category=Sneakers">Sneakers</Link></li>
              <li><Link href="/shop?category=Formal">Formal</Link></li>
              <li><Link href="/shop?category=Boots">Boots</Link></li>
              <li><Link href="/shop?category=Heels">Heels</Link></li>
              <li><Link href="/shop?gender=Men">Men&apos;s</Link></li>
              <li><Link href="/shop?gender=Women">Women&apos;s</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Company</h4>
            <ul className={styles.colLinks}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Press</Link></li>
              <li><Link href="#">Sustainability</Link></li>
              <li><Link href="#">Affiliates</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Support</h4>
            <ul className={styles.colLinks}>
              <li><Link href="#">Size Guide</Link></li>
              <li><Link href="#">Shipping & Returns</Link></li>
              <li><Link href="#">Track Order</Link></li>
              <li><Link href="#">FAQs</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact Us</h4>
            <ul className={styles.contactList}>
              <li>
                <Mail size={15} className={styles.contactIcon} />
                <span>hello@shoeking.com</span>
              </li>
              <li>
                <Phone size={15} className={styles.contactIcon} />
                <span>+1 (800) SHOE-KING</span>
              </li>
              <li>
                <MapPin size={15} className={styles.contactIcon} />
                <span>123 Crown Avenue,<br />New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} Shoe King. All rights reserved. Crafted with ♛ for footwear lovers.
          </p>
          <div className={styles.payments}>
            <span className={styles.paymentBadge}>Visa</span>
            <span className={styles.paymentBadge}>Mastercard</span>
            <span className={styles.paymentBadge}>PayPal</span>
            <span className={styles.paymentBadge}>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
