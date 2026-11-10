/**
 * db.js — Pure-JS JSON file database for Shoe King
 * No native modules needed. Data is persisted to shoe_king_db.json
 */

const fs   = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "shoe_king_db.json");

// ── Initial seed data ─────────────────────────────────────────────────────────
const SEED_PRODUCTS = [
  {
    id: 1, name: "Air Monarch Elite", brand: "Shoe King", category: "Sneakers",
    price: 189, originalPrice: 249, rating: 4.8, reviews: 342,
    colors: ["#1a1a2e","#C9A84C","#ffffff"], colorNames: ["Midnight","Gold Rush","Arctic White"],
    sizes: [38,39,40,41,42,43,44,45],
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
    badge: "Best Seller",
    description: "The Air Monarch Elite redefines luxury athletic footwear. Crafted with premium full-grain leather upper and our signature cloud-cushion midsole.",
    features: ["Full-grain leather upper","Cloud-cushion midsole","Carbon fiber heel plate","Premium rubber outsole"],
    inStock: true, isNew: false, isSale: true, gender: "Men", createdAt: new Date().toISOString()
  },
  {
    id: 2, name: "Velocity Pro X", brand: "Shoe King", category: "Running",
    price: 215, originalPrice: 215, rating: 4.9, reviews: 218,
    colors: ["#e8c96a","#2d2d3a","#c0392b"], colorNames: ["Champagne","Obsidian","Crimson"],
    sizes: [38,39,40,41,42,43,44],
    images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80"],
    badge: "New",
    description: "Built for champions who demand more. The Velocity Pro X features our revolutionary HyperFoam technology that adapts to your stride in real time.",
    features: ["HyperFoam adaptive midsole","Breathable mesh knit upper","Anti-slip waffle outsole","Reflective detailing"],
    inStock: true, isNew: true, isSale: false, gender: "Unisex", createdAt: new Date().toISOString()
  },
  {
    id: 3, name: "Crown Classic Oxford", brand: "Shoe King", category: "Formal",
    price: 320, originalPrice: 320, rating: 4.7, reviews: 95,
    colors: ["#3d2b1f","#1a1a1a","#8b6914"], colorNames: ["Cognac","Jet Black","Honey Tan"],
    sizes: [39,40,41,42,43,44,45],
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80"],
    badge: "Premium",
    description: "A masterpiece of cobbling artistry. Hand-crafted from Italian full-grain calf leather with Goodyear welt construction for lifelong durability.",
    features: ["Italian full-grain calf leather","Goodyear welt construction","Leather lining","Double leather sole"],
    inStock: true, isNew: false, isSale: false, gender: "Men", createdAt: new Date().toISOString()
  },
  {
    id: 4, name: "Empress Heel Luxe", brand: "Shoe King", category: "Heels",
    price: 275, originalPrice: 350, rating: 4.6, reviews: 173,
    colors: ["#C9A84C","#1a1a1a","#d4a0b0"], colorNames: ["Gold","Noir","Rose"],
    sizes: [36,37,38,39,40,41],
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"],
    badge: "Sale",
    description: "Walk with confidence in the Empress Heel Luxe. Designed with a padded insole and architectural heel for all-day comfort without sacrificing elegance.",
    features: ["Genuine suede upper","Padded memory foam insole","Anti-slip outsole","Adjustable ankle strap"],
    inStock: true, isNew: false, isSale: true, gender: "Women", createdAt: new Date().toISOString()
  },
  {
    id: 5, name: "Urban Drift Boot", brand: "Shoe King", category: "Boots",
    price: 298, originalPrice: 298, rating: 4.8, reviews: 267,
    colors: ["#3d2b1f","#2d2d3a","#556b2f"], colorNames: ["Bourbon","Slate","Forest"],
    sizes: [39,40,41,42,43,44,45,46],
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80"],
    badge: "New",
    description: "Where rugged meets refined. Built with waterproof full-grain leather and a Vibram outsole for city streets or mountain trails.",
    features: ["Waterproof full-grain leather","Vibram outsole","Gore-Tex lining","Cushioned footbed"],
    inStock: true, isNew: true, isSale: false, gender: "Men", createdAt: new Date().toISOString()
  },
  {
    id: 6, name: "Glide Sport Slide", brand: "Shoe King", category: "Slides",
    price: 89, originalPrice: 120, rating: 4.5, reviews: 421,
    colors: ["#1a1a2e","#C9A84C","#e8e8e8"], colorNames: ["Navy","Gold","White"],
    sizes: [36,37,38,39,40,41,42,43,44],
    images: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80"],
    badge: "Sale",
    description: "Ultimate recovery footwear. The Glide Sport Slide features our BioFoam footbed that contours to your foot for superior support.",
    features: ["BioFoam contoured footbed","Single strap design","Anti-microbial lining","Flexible rubber outsole"],
    inStock: true, isNew: false, isSale: true, gender: "Unisex", createdAt: new Date().toISOString()
  },
  {
    id: 7, name: "Nova Street Low", brand: "Shoe King", category: "Sneakers",
    price: 159, originalPrice: 159, rating: 4.7, reviews: 184,
    colors: ["#ffffff","#2d2d3a","#c0392b"], colorNames: ["White","Obsidian","Flame"],
    sizes: [38,39,40,41,42,43,44,45],
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"],
    badge: null,
    description: "Clean lines, bold attitude. A versatile lifestyle sneaker built for the streets but designed for the runway.",
    features: ["Premium leather upper","Gum rubber outsole","Foam-padded tongue","Embossed Shoe King logo"],
    inStock: true, isNew: false, isSale: false, gender: "Unisex", createdAt: new Date().toISOString()
  },
  {
    id: 8, name: "Serenity Ballerina", brand: "Shoe King", category: "Flats",
    price: 145, originalPrice: 145, rating: 4.6, reviews: 93,
    colors: ["#d4a0b0","#C9A84C","#2d2d3a"], colorNames: ["Blush","Gold","Navy"],
    sizes: [35,36,37,38,39,40,41],
    images: ["https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=80"],
    badge: null,
    description: "Grace in every step. Combines supple nappa leather with a cushioned footbed for effortless all-day elegance.",
    features: ["Nappa leather upper","Cushioned insole","Flexible sole","Slim profile design"],
    inStock: true, isNew: false, isSale: false, gender: "Women", createdAt: new Date().toISOString()
  }
];

// ── Load or initialise DB ─────────────────────────────────────────────────────
function loadDB() {
  if (fs.existsSync(DB_PATH)) {
    try { return JSON.parse(fs.readFileSync(DB_PATH, "utf8")); } catch {}
  }
  return { users: [], products: SEED_PRODUCTS, orders: [], cart: [], wishlist: [], _nextId: { users: 1, orders: 1, cart: 1, wishlist: 1 } };
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

let _db = loadDB();

// Always persist on first load (creates the file if new)
saveDB(_db);

// Auto-increment helper
function nextId(table) {
  if (!_db._nextId) _db._nextId = {};
  _db._nextId[table] = (_db._nextId[table] || 0) + 1;
  return _db._nextId[table];
}

// ── Public API ────────────────────────────────────────────────────────────────
const db = {
  get: () => _db,

  // Collections shorthand
  col: (name) => _db[name],

  insert(table, record) {
    const id = record.id !== undefined ? record.id : nextId(table);
    const row = { id, ...record, createdAt: record.createdAt || new Date().toISOString() };
    _db[table].push(row);
    saveDB(_db);
    return row;
  },

  findOne(table, predicate) {
    return _db[table].find(predicate) || null;
  },

  findAll(table, predicate) {
    return predicate ? _db[table].filter(predicate) : [..._db[table]];
  },

  update(table, predicate, changes) {
    let updated = null;
    _db[table] = _db[table].map((r) => {
      if (predicate(r)) { updated = { ...r, ...changes }; return updated; }
      return r;
    });
    saveDB(_db);
    return updated;
  },

  remove(table, predicate) {
    _db[table] = _db[table].filter((r) => !predicate(r));
    saveDB(_db);
  },

  save() { saveDB(_db); },
};

// Ensure products table is seeded (for fresh DB files missing it)
if (!_db.products || _db.products.length === 0) {
  _db.products = SEED_PRODUCTS;
  saveDB(_db);
  console.log("✅ Database seeded with 8 products.");
}

module.exports = db;
