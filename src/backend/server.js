require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes     = require("./routes/auth");
const productsRoutes = require("./routes/products");
const ordersRoutes   = require("./routes/orders");
const cartRoutes     = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const userRoutes     = require("./routes/user");

const app  = express();
const PORT = process.env.PORT || 8000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders",   ordersRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user",     userRoutes);

// ── Health check ───────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok", message: "Shoe King API is running 🚀" }));

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Shoe King API running at http://localhost:${PORT}/api`);
  console.log(`💡 Health check: http://localhost:${PORT}/api/health`);
});
