const router   = require("express").Router();
const db       = require("../db");
const { auth } = require("./auth");

// GET /api/products
router.get("/", (req, res) => {
  const {
    category, gender, min_price, max_price,
    search, sort, is_new, is_sale,
    page = 1, limit = 20,
  } = req.query;

  let products = db.findAll("products");

  // Filters
  if (category && category !== "All") products = products.filter((p) => p.category === category);
  if (gender   && gender   !== "All") products = products.filter((p) => p.gender   === gender);
  if (min_price) products = products.filter((p) => p.price >= Number(min_price));
  if (max_price) products = products.filter((p) => p.price <= Number(max_price));
  if (is_new  === "true" || is_new  === "1") products = products.filter((p) => p.isNew);
  if (is_sale === "true" || is_sale === "1") products = products.filter((p) => p.isSale);
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) ||
             (p.description || "").toLowerCase().includes(q) ||
             p.category.toLowerCase().includes(q)
    );
  }

  // Sorting
  const sorters = {
    newest:       (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    "price-asc":  (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating:       (a, b) => b.rating - a.rating,
    featured:     (a, b) => b.reviews - a.reviews,
  };
  products.sort(sorters[sort] || sorters.featured);

  const total  = products.length;
  const offset = (Number(page) - 1) * Number(limit);
  const paged  = products.slice(offset, offset + Number(limit));

  res.json({ products: paged, total, page: Number(page), limit: Number(limit) });
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const p = db.findOne("products", (p) => p.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: "Product not found" });
  res.json(p);
});

// POST /api/products  (protected)
router.post("/", auth, (req, res) => {
  const d = req.body;
  const allProducts = db.findAll("products");
  const newId = allProducts.length > 0 ? Math.max(...allProducts.map((p) => p.id)) + 1 : 1;
  const product = db.insert("products", {
    id: newId,
    name: d.name, brand: d.brand || "Shoe King", category: d.category,
    price: d.price, originalPrice: d.originalPrice || d.price,
    rating: d.rating || 0, reviews: d.reviews || 0,
    colors: d.colors || [], colorNames: d.colorNames || [],
    sizes: d.sizes || [], images: d.images || [],
    badge: d.badge || null, description: d.description || "",
    features: d.features || [],
    inStock: d.inStock !== false, isNew: Boolean(d.isNew), isSale: Boolean(d.isSale),
    gender: d.gender || "Unisex",
  });
  res.status(201).json(product);
});

// PUT /api/products/:id  (protected)
router.put("/:id", auth, (req, res) => {
  const d  = req.body;
  const id = Number(req.params.id);
  const updated = db.update("products", (p) => p.id === id, {
    name: d.name, brand: d.brand || "Shoe King", category: d.category,
    price: d.price, originalPrice: d.originalPrice || d.price,
    rating: d.rating || 0, reviews: d.reviews || 0,
    colors: d.colors || [], colorNames: d.colorNames || [],
    sizes: d.sizes || [], images: d.images || [],
    badge: d.badge || null, description: d.description || "",
    features: d.features || [],
    inStock: d.inStock !== false, isNew: Boolean(d.isNew), isSale: Boolean(d.isSale),
    gender: d.gender || "Unisex",
  });
  if (!updated) return res.status(404).json({ error: "Product not found" });
  res.json(updated);
});

// DELETE /api/products/:id  (protected)
router.delete("/:id", auth, (req, res) => {
  db.remove("products", (p) => p.id === Number(req.params.id));
  res.json({ message: "Product deleted" });
});

module.exports = router;
