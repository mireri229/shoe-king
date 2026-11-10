const router = require("express").Router();
const prisma = require("../prisma");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

// GET /api/cart
router.get("/", async (req, res) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart
router.post("/", async (req, res) => {
  try {
    const { product_id, qty = 1, size, color } = req.body;
    const item = await prisma.cartItem.upsert({
      where: { userId_productId_size_color: { userId: req.user.id, productId: product_id, size: size ?? "", color: color ?? "" } },
      update: { qty: { increment: qty } },
      create: { userId: req.user.id, productId: product_id, qty, size, color },
      include: { product: true },
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/cart/:id
router.put("/:id", async (req, res) => {
  try {
    const item = await prisma.cartItem.update({
      where: { id: parseInt(req.params.id) },
      data: { qty: req.body.qty },
      include: { product: true },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart/:id  (single item)
router.delete("/:id", async (req, res) => {
  try {
    await prisma.cartItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart  (clear entire cart)
router.delete("/", async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
