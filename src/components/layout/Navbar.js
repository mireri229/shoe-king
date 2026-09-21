"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingBag, Heart, Search, Menu, X, Crown } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/shop?category=Sneakers", label: "Sneakers" },
    { href: "/shop?category=Formal", label: "Formal" },
    { href: "/shop?category=Boots", label: "Boots" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Crown size={24} className={styles.logoIcon} />
            <span>SHOE <span className="gold-text">KING</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Search */}
            <button
              className={`btn btn-icon btn-ghost ${styles.actionBtn}`}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className={`btn btn-icon btn-ghost ${styles.actionBtn}`} aria-label="Wishlist">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className={styles.badge}>{wishlistItems.length}</span>
              )}
            </Link>

            {/* Cart */}
            <button
              className={`btn btn-icon btn-ghost ${styles.actionBtn}`}
              onClick={() => setIsOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </button>

            {/* Auth */}
            <Link href="/login" className={`btn btn-primary btn-sm ${styles.authBtn}`}>
              Sign In
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className={`btn btn-icon btn-ghost ${styles.menuToggle}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className={styles.searchBar}>
            <div className="container">
              <div className={styles.searchInner}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Search for shoes, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button className={`btn btn-primary btn-sm`} onClick={() => {
                  if (searchQuery) window.location.href = `/shop?search=${searchQuery}`;
                }}>
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" className={`btn btn-primary`} onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
