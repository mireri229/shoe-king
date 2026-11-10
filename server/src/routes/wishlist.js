const router = require("express").Router();
const prisma = require("../prisma");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

// GET /api/wishlist
router.get("/", async (req, res) => {
  try {
    const items = await prisma.wishlistItem.findMany({ where: { userId: req.user.id }, include: { product: true } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/wishlist (toggle)
router.post("/", async (req, res) => {
  try {
    const { product_id } = req.body;
    const existing = await prisma.wishlistItem.findUnique({ where: { userId_productId: { userId: req.user.id, productId: product_id } } });
    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return res.json({ wishlisted: false });
    }
    await prisma.wishlistItem.create({ data: { userId: req.user.id, productId: product_id } });
    res.status(201).json({ wishlisted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/wishlist/:productId
router.delete("/:productId", async (req, res) => {
  try {
    await prisma.wishlistItem.deleteMany({ where: { userId: req.user.id, productId: parseInt(req.params.productId) } });
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
