const router   = require("express").Router();
const db       = require("../db");
const { auth } = require("./auth");

// GET /api/orders
router.get("/", auth, (req, res) => {
  const page   = Number(req.query.page) || 1;
  const limit  = 10;
  const orders = db.findAll("orders", (o) => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const paged  = orders.slice((page - 1) * limit, page * limit);
  res.json({ orders: paged, page });
});

// GET /api/orders/:id
router.get("/:id", auth, (req, res) => {
  const order = db.findOne("orders", (o) => o.id === Number(req.params.id) && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// POST /api/orders
router.post("/", auth, (req, res) => {
  const { items, shipping_address } = req.body;
  if (!items || !items.length)
    return res.status(400).json({ error: "Order must have at least one item" });

  let total = 0;
  const enriched = items.map((item) => {
    const p = db.findOne("products", (p) => p.id === Number(item.product_id));
    if (!p) throw Object.assign(new Error(`Product ${item.product_id} not found`), { status: 404 });
    const subtotal = p.price * item.qty;
    total += subtotal;
    return { ...item, name: p.name, price: p.price, subtotal };
  });

  const allOrders = db.findAll("orders");
  const newId = allOrders.length > 0 ? Math.max(...allOrders.map((o) => o.id)) + 1 : 1;

  const order = db.insert("orders", {
    id: newId,
    userId: req.user.id,
    items: enriched,
    shipping_address: shipping_address || {},
    total,
    status: "pending",
  });

  // Clear the cart
  db.remove("cart", (c) => c.userId === req.user.id);

  res.status(201).json(order);
});

// PUT /api/orders/:id  (update status)
router.put("/:id", auth, (req, res) => {
  const { status } = req.body;
  const id = Number(req.params.id);
  const updated = db.update(
    "orders",
    (o) => o.id === id && o.userId === req.user.id,
    { status }
  );
  if (!updated) return res.status(404).json({ error: "Order not found" });
  res.json(updated);
});

module.exports = router;
