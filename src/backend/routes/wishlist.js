const router   = require("express").Router();
const db       = require("../db");
const { auth } = require("./auth");

function getWishlistWithProducts(userId) {
  const items = db.findAll("wishlist", (w) => w.userId === userId);
  return items.map((w) => {
    const p = db.findOne("products", (p) => p.id === w.productId);
    if (!p) return null;
    return {
      id:         w.id,
      product_id: p.id,
      name:       p.name,
      price:      p.price,
      original_price: p.originalPrice,
      images:     p.images,
      rating:     p.rating,
      badge:      p.badge,
      isNew:      p.isNew,
      isSale:     p.isSale,
      inStock:    p.inStock,
    };
  }).filter(Boolean);
}

// GET /api/wishlist
router.get("/", auth, (req, res) => {
  res.json({ items: getWishlistWithProducts(req.user.id) });
});

// POST /api/wishlist  (toggle)
router.post("/", auth, (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: "product_id is required" });

  const existing = db.findOne("wishlist", (w) =>
    w.userId === req.user.id && w.productId === Number(product_id)
  );

  if (existing) {
    db.remove("wishlist", (w) => w.id === existing.id);
    res.json({ items: getWishlistWithProducts(req.user.id), added: false });
  } else {
    const allWishlist = db.findAll("wishlist");
    const newId = allWishlist.length > 0 ? Math.max(...allWishlist.map((w) => w.id)) + 1 : 1;
    db.insert("wishlist", { id: newId, userId: req.user.id, productId: Number(product_id) });
    res.json({ items: getWishlistWithProducts(req.user.id), added: true });
  }
});

// DELETE /api/wishlist/:product_id
router.delete("/:product_id", auth, (req, res) => {
  db.remove("wishlist", (w) =>
    w.userId === req.user.id && w.productId === Number(req.params.product_id)
  );
  res.json({ items: getWishlistWithProducts(req.user.id) });
});

module.exports = router;
