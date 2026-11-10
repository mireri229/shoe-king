
/**
 * Shoe King — API Client
 * Centralizes all calls to the backend (/api)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// ── Token helpers (browser-side) ──────────────────────────────────────────
export const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("sk_token") : null;

export const setToken = (token) => {
  if (typeof window !== "undefined") localStorage.setItem("sk_token", token);
};

export const clearToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem("sk_token");
};

// ── Core fetch wrapper ────────────────────────────────────────────────────
async function apiFetch(endpoint, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

// ════════════════════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════════════════════
export const authApi = {
  register: (name, email, password) =>
    apiFetch("/auth/register", { method: "POST", body: { name, email, password } }),

  login: (email, password) =>
    apiFetch("/auth/login", { method: "POST", body: { email, password } }),

  loginWithGoogle: (payload = {}) =>
    apiFetch("/auth/google", { method: "POST", body: payload }),

  me: () => apiFetch("/auth/me", { auth: true }),

  logout: () => {
    clearToken();
    return Promise.resolve({ message: "Logged out" });
  },
};

// ════════════════════════════════════════════════════════════════════════════
//  PRODUCTS
// ════════════════════════════════════════════════════════════════════════════
export const productsApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== "" && v !== "All"))
    ).toString();
    return apiFetch(`/products${params ? "?" + params : ""}`);
  },

  getById: (id) => apiFetch(`/products/${id}`),

  create: (data) =>
    apiFetch("/products", { method: "POST", body: data, auth: true }),

  update: (id, data) =>
    apiFetch(`/products/${id}`, { method: "PUT", body: data, auth: true }),

  delete: (id) =>
    apiFetch(`/products/${id}`, { method: "DELETE", auth: true }),
};

// ════════════════════════════════════════════════════════════════════════════
//  ORDERS
// ════════════════════════════════════════════════════════════════════════════
export const ordersApi = {
  getAll: (page = 1) => apiFetch(`/orders?page=${page}`, { auth: true }),

  getById: (id) => apiFetch(`/orders/${id}`, { auth: true }),

  place: (items, shippingAddress) =>
    apiFetch("/orders", {
      method: "POST",
      body: { items, shipping_address: shippingAddress },
      auth: true,
    }),

  updateStatus: (id, status) =>
    apiFetch(`/orders/${id}`, { method: "PUT", body: { status }, auth: true }),
};

// ════════════════════════════════════════════════════════════════════════════
//  CART
// ════════════════════════════════════════════════════════════════════════════
export const cartApi = {
  get: () => apiFetch("/cart", { auth: true }),

  add: (product_id, qty, size, color) =>
    apiFetch("/cart", { method: "POST", body: { product_id, qty, size, color }, auth: true }),

  update: (cartItemId, qty) =>
    apiFetch(`/cart/${cartItemId}`, { method: "PUT", body: { qty }, auth: true }),

  remove: (cartItemId) =>
    apiFetch(`/cart/${cartItemId}`, { method: "DELETE", auth: true }),

  clear: () => apiFetch("/cart", { method: "DELETE", auth: true }),
};

// ════════════════════════════════════════════════════════════════════════════
//  WISHLIST
// ════════════════════════════════════════════════════════════════════════════
export const wishlistApi = {
  get: () => apiFetch("/wishlist", { auth: true }),

  toggle: (product_id) =>
    apiFetch("/wishlist", { method: "POST", body: { product_id }, auth: true }),

  remove: (product_id) =>
    apiFetch(`/wishlist/${product_id}`, { method: "DELETE", auth: true }),
};

// ════════════════════════════════════════════════════════════════════════════
//  USER PROFILE
// ════════════════════════════════════════════════════════════════════════════
export const userApi = {
  getProfile: () => apiFetch("/user", { auth: true }),

  updateProfile: (data) =>
    apiFetch("/user", { method: "PUT", body: data, auth: true }),
};
