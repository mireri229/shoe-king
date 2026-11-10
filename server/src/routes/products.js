const router = require("express").Router();
const prisma = require("../prisma");
const { authenticate, requireAdmin } = require("../middleware/auth");

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { category, gender, min_price, max_price, search, sort, is_new, is_sale, page = 1, limit = 12 } = req.query;

    const where = {};
    if (category && category !== "All") where.category = category;
    if (gender && gender !== "All") where.gender = gender;
    if (is_new === "true") where.isNew = true;
    if (is_sale === "true") where.isSale = true;
    if (min_price || max_price) where.price = { gte: min_price ? parseFloat(min_price) : undefined, lte: max_price ? parseFloat(max_price) : undefined };
    if (search) where.OR = [{ name: { contains: search, mode: "insensitive" } }, { brand: { contains: search, mode: "insensitive" } }];

    const orderBy = sort === "price_asc" ? { price: "asc" } : sort === "price_desc" ? { price: "desc" } : sort === "newest" ? { createdAt: "desc" } : { createdAt: "desc" };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: parseInt(limit) }),
      prisma.product.count({ where }),
    ]);

    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products (admin only)
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await prisma.product.create({ data: req.body });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id (admin only)
router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await prisma.product.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id (admin only)
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
