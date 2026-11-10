"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { products, categories, genders, sortOptions } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { SlidersHorizontal, X, ChevronDown, Lock, Crown, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

function ShopContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const initCategory = searchParams.get("category") || "All";
  const initGender = searchParams.get("gender") || "All";
  const initSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initCategory);
  const [selectedGender, setSelectedGender] = useState(initGender);
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState(initSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== "All") list = list.filter((p) => p.category === selectedCategory);
    if (selectedGender !== "All") list = list.filter((p) => p.gender === selectedGender || p.gender === "Unisex");
    if (onSaleOnly) list = list.filter((p) => p.isSale);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: break;
    }
    return list;
  }, [selectedCategory, selectedGender, priceRange, sort, search, onSaleOnly]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedGender("All");
    setPriceRange([0, 400]);
    setOnSaleOnly(false);
    setSearch("");
  };

  const hasActiveFilters = selectedCategory !== "All" || selectedGender !== "All" || onSaleOnly || search || priceRange[1] < 400;

  if (!authLoading && !user) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ maxWidth: 540, textAlign: "center", padding: "80px 20px" }}>
          <div style={{
            display: "inline-flex",
            padding: 20,
            borderRadius: "50%",
            background: "rgba(201,168,76,0.1)",
            marginBottom: 20,
          }}>
            <Lock size={48} color="var(--gold-400)" />
          </div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 12 }}>
            Sign In <span className="gold-gradient-text">Required</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1.6, marginBottom: 28 }}>
            Please sign in to access the Shoe King store, explore collections, and make purchases.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/login?redirect=/shop&reason=shop"
              className="btn btn-primary btn-lg"
              style={{ justifyContent: "center" }}
            >
              Sign In to Shop <ArrowRight size={18} />
            </Link>
            <Link
              href="/register"
              className="btn btn-outline"
              style={{ justifyContent: "center" }}
            >
              Don&apos;t have an account? Create one free
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>Our Collection</p>
          <h1 className={styles.pageTitle}>
            Shop <span className="gold-gradient-text">All Shoes</span>
          </h1>
          <p className={styles.pageSub}>
            {filtered.length} styles available
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>Filters</h3>
              {hasActiveFilters && (
                <button className={styles.clearBtn} onClick={clearFilters}>
                  Clear all
                </button>
              )}
            </div>

            {/* Search */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Search</h4>
              <input
                className="input"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Category</h4>
              <div className={styles.filterPills}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`${styles.pill} ${selectedCategory === cat ? styles.pillActive : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Gender</h4>
              <div className={styles.filterPills}>
                {genders.map((g) => (
                  <button
                    key={g}
                    className={`${styles.pill} ${selectedGender === g ? styles.pillActive : ""}`}
                    onClick={() => setSelectedGender(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>
                Price Range <span className="text-gold">${priceRange[0]} — ${priceRange[1]}</span>
              </h4>
              <input
                type="range"
                min={0}
                max={400}
                step={10}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>$0</span>
                <span>$400</span>
              </div>
            </div>

            {/* Sale */}
            <div className={styles.filterGroup}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className={styles.checkbox}
                />
                On Sale Only
              </label>
            </div>
          </aside>

          {/* Main Content */}
          <div className={styles.main}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button
                className={`btn btn-ghost btn-sm ${styles.filterToggle}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters {hasActiveFilters && <span className={styles.filterBadge} />}
              </button>
              <span className={styles.resultCount}>{filtered.length} products</span>
              <div className={styles.sortWrap}>
                <ChevronDown size={14} className={styles.sortIcon} />
                <select
                  className={styles.sortSelect}
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className={styles.activeTags}>
                {selectedCategory !== "All" && (
                  <span className={styles.tag}>
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")}><X size={12} /></button>
                  </span>
                )}
                {selectedGender !== "All" && (
                  <span className={styles.tag}>
                    {selectedGender}
                    <button onClick={() => setSelectedGender("All")}><X size={12} /></button>
                  </span>
                )}
                {onSaleOnly && (
                  <span className={styles.tag}>
                    On Sale
                    <button onClick={() => setOnSaleOnly(false)}><X size={12} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className={styles.grid}>
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <span style={{ fontSize: 48 }}>👟</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "80px 0", textAlign: "center" }}>Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
