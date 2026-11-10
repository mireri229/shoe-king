const router  = require("express").Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const db      = require("../db");

const SECRET = process.env.JWT_SECRET || "shoe_king_secret";

// ── JWT middleware (exported for other routes) ────────────────────────────────
function auth(req, res, next) {
  const header = req.headers["authorization"] || "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Name, email and password are required" });

  const existing = db.findOne("users", (u) => u.email === email);
  if (existing) return res.status(409).json({ error: "Email already registered" });

  const hash = bcrypt.hashSync(password, 10);
  const user = db.insert("users", { name, email, password: hash, role: "customer" });

  const { password: _pw, ...safe } = user;
  const token = jwt.sign({ id: safe.id, role: safe.role }, SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: safe });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const user = db.findOne("users", (u) => u.email === email);
  if (!user)
    return res.status(404).json({ error: "No account found with this email. Please create an account first." });

  if (!bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: "Incorrect password. Please try again." });

  const { password: _pw, ...safe } = user;
  const token = jwt.sign({ id: safe.id, role: safe.role }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: safe });
});

// POST /api/auth/google
router.post("/google", (req, res) => {
  const { name, email } = req.body || {};
  const userEmail = email || "user@gmail.com";
  let user = db.findOne("users", (u) => u.email === userEmail);
  if (!user) {
    user = db.insert("users", { name: name || "Google User", email: userEmail, password: "google_oauth_user", role: "customer" });
  }
  const { password: _pw, ...safe } = user;
  const token = jwt.sign({ id: safe.id, role: safe.role }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: safe });
});

// GET /api/auth/me
router.get("/me", auth, (req, res) => {
  const user = db.findOne("users", (u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password: _pw, ...safe } = user;
  res.json({ user: safe });
});

module.exports = router;
module.exports.auth = auth;
