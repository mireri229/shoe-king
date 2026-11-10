const router   = require("express").Router();
const bcrypt   = require("bcryptjs");
const db       = require("../db");
const { auth } = require("./auth");

// GET /api/user
router.get("/", auth, (req, res) => {
  const user = db.findOne("users", (u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password: _pw, ...safe } = user;
  res.json({ user: safe });
});

// PUT /api/user
router.put("/", auth, (req, res) => {
  const { name, email, password } = req.body;
  const current = db.findOne("users", (u) => u.id === req.user.id);
  if (!current) return res.status(404).json({ error: "User not found" });

  // Check email not already taken
  if (email && email !== current.email) {
    const taken = db.findOne("users", (u) => u.email === email && u.id !== req.user.id);
    if (taken) return res.status(409).json({ error: "Email already in use" });
  }

  const changes = {
    name:     name     || current.name,
    email:    email    || current.email,
    password: password ? bcrypt.hashSync(password, 10) : current.password,
  };

  const updated = db.update("users", (u) => u.id === req.user.id, changes);
  const { password: _pw, ...safe } = updated;
  res.json({ user: safe });
});

module.exports = router;
