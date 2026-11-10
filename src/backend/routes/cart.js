const router   = require("express").Router();
const db       = require("../db");
const { auth } = require("./auth");

function getCartWithProducts(userId) {
  const cartItems = db.findAll("cart", (c) => c.userId === userId);
  return cartItems.map((c) => {
    const p = db.findOne("products", (p) => p.id === c.productId);
    if (!p) return null;
    return {
      id:            c.id,
      qty:           c.qty,
      size:          c.size,
      color:         c.color,
      product_id:    p.id,
      name:          p.name,
      price:         p.price,
      original_price: p.originalPrice,
      images:        p.images,
      inStock:       p.inStock,
    };
  }).filter(Boolean);
}

// GET /api/cart
router.get("/", auth, (req, res) => {
  res.json({ items: getCartWithProducts(req.user.id) });
});

// POST /api/cart
router.post("/", auth, (req, res) => {
  const { product_id, qty = 1, size = "", color = "" } = req.body;
  if (!product_id) return res.status(400).json({ error: "product_id is required" });

  // Check if same item already in cart (same product + size + color)
  const existing = db.findOne("cart", (c) =>
    c.userId === req.user.id &&
    c.productId === Number(product_id) &&
    c.size  === size &&
    c.color === color
  );

  if (existing) {
    db.update("cart", (c) => c.id === existing.id, { qty: existing.qty + qty });
  } else {
    const allCart = db.findAll("cart");
    const newId = allCart.length > 0 ? Math.max(...allCart.map((c) => c.id)) + 1 : 1;
    db.insert("cart", { id: newId, userId: req.user.id, productId: Number(product_id), qty, size, color });
  }

  res.json({ items: getCartWithProducts(req.user.id) });
});

// PUT /api/cart/:id
router.put("/:id", auth, (req, res) => {
  const { qty } = req.body;
  const id = Number(req.params.id);
  if (Number(qty) < 1) {
    db.remove("cart", (c) => c.id === id && c.userId === req.user.id);
  } else {
    db.update("cart", (c) => c.id === id && c.userId === req.user.id, { qty: Number(qty) });
  }
  res.json({ items: getCartWithProducts(req.user.id) });
});

// DELETE /api/cart/:id  (single item)
router.delete("/:id", auth, (req, res) => {
  db.remove("cart", (c) => c.id === Number(req.params.id) && c.userId === req.user.id);
  res.json({ items: getCartWithProducts(req.user.id) });
});

// DELETE /api/cart  (clear all)
router.delete("/", auth, (req, res) => {
  db.remove("cart", (c) => c.userId === req.user.id);
  res.json({ items: [] });
});

module.exports = router;
