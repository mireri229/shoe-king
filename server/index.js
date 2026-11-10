require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// -- Middleware ----------------------------------------------------------------
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during local development
    }
  },
  credentials: true
}));
app.use(express.json());

// -- Routes --------------------------------------------------------------------
app.use("/api/auth",     require("./src/routes/auth"));
app.use("/api/products", require("./src/routes/products"));
app.use("/api/cart",     require("./src/routes/cart"));
app.use("/api/orders",   require("./src/routes/orders"));
app.use("/api/wishlist", require("./src/routes/wishlist"));
app.use("/api/user",     require("./src/routes/user"));

// -- Health check -------------------------------------------------------------
app.get("/", (req, res) => res.json({ status: "Shoe King API is running ??" }));

// -- 404 handler ---------------------------------------------------------------
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// -- Error handler -------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// -- Start ---------------------------------------------------------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Shoe King API running on http://localhost:${PORT}`));
