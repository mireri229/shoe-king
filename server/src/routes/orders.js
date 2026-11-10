const router = require("express").Router();
const prisma = require("../prisma");
const { authenticate, requireAdmin } = require("../middleware/auth");

router.use(authenticate);

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * 10;
    const where = req.user.role === "admin" ? {} : { userId: req.user.id };
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, skip, take: 10, include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.order.count({ where }),
    ]);
    res.json({ orders, total, page: parseInt(page), pages: Math.ceil(total / 10) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.userId !== req.user.id && req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { items, shipping_address } = req.body;
    const productIds = items.map((i) => i.product_id);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    const total = items.reduce((sum, item) => {
      const p = products.find((p) => p.id === item.product_id);
      return sum + (p ? (p.salePrice ?? p.price) * item.qty : 0);
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        shippingAddress: shipping_address,
        items: {
          create: items.map((item) => {
            const p = products.find((p) => p.id === item.product_id);
            return { productId: item.product_id, qty: item.qty, size: item.size, color: item.color, price: p?.salePrice ?? p?.price ?? 0 };
          }),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Clear cart after order
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const order = await prisma.order.update({ where: { id: parseInt(req.params.id) }, data: { status: req.body.status } });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
