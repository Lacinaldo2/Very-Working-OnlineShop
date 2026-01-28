import usersSeed from "../data/users.json";

const USERS_KEY = "users_db_v1";
const ORDERS_KEY = "orders";
const REVIEWS_KEY = "reviews_db_v1";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    return data ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const ensureUsers = () => {
  const existing = readJson(USERS_KEY, null);
  if (Array.isArray(existing) && existing.length) return existing;

  const seeded = Array.isArray(usersSeed) ? usersSeed : [];
  const normalized = seeded.map((u, idx) => ({
    id: u.id ?? Date.now() + idx,
    username: u.username ?? u.login ?? `user${idx + 1}`,
    password: u.password ?? "password",
    name: u.name ?? u.username ?? `User ${idx + 1}`,
    role: u.role ?? (u.username === "admin" ? "admin" : "user"),
  }));

  writeJson(USERS_KEY, normalized);
  return normalized;
};

export const api = {
  async authLogin(username, password) {
    await delay(250);
    const users = ensureUsers();
    const u =
      users.find(
        (x) =>
          String(x.username) === String(username) &&
          String(x.password) === String(password),
      ) || null;
    if (!u) return { ok: false, error: "Nieprawidłowy login lub hasło." };
    const safeUser = {
      id: u.id,
      username: u.username,
      name: u.name,
      role: u.role,
    };
    return { ok: true, user: safeUser };
  },

  async authRegister({ username, password, name }) {
    await delay(250);
    const users = ensureUsers();
    const exists = users.some((u) => String(u.username) === String(username));
    if (exists) return { ok: false, error: "Taki użytkownik już istnieje." };
    const created = {
      id: Date.now(),
      username: String(username),
      password: String(password),
      name: String(name || username),
      role: "user",
    };
    const next = [created, ...users];
    writeJson(USERS_KEY, next);
    const safeUser = {
      id: created.id,
      username: created.username,
      name: created.name,
      role: created.role,
    };
    return { ok: true, user: safeUser };
  },

  async ordersCreate({ user, items, total }) {
    await delay(250);
    const orders = readJson(ORDERS_KEY, []);
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: Array.isArray(items) ? items : [],
      total: Number(total) || 0,
      user: user?.username ?? "guest",
    };
    const next = [newOrder, ...(Array.isArray(orders) ? orders : [])];
    writeJson(ORDERS_KEY, next);
    return { ok: true, order: newOrder };
  },

  async ordersForUser(username) {
    await delay(200);
    const orders = readJson(ORDERS_KEY, []);
    const list = (Array.isArray(orders) ? orders : []).filter(
      (o) => String(o.user) === String(username),
    );
    return { ok: true, orders: list };
  },

  async ordersGetById(orderId) {
    await delay(200);
    const orders = readJson(ORDERS_KEY, []);
    const o =
      (Array.isArray(orders) ? orders : []).find(
        (x) => String(x.id) === String(orderId),
      ) || null;
    return { ok: true, order: o };
  },

  async reviewsForProduct(productId) {
    await delay(150);
    const db = readJson(REVIEWS_KEY, []);
    const pid = String(productId);
    const list = (Array.isArray(db) ? db : [])
      .filter((r) => String(r.productId) === pid)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return { ok: true, reviews: list };
  },

  async reviewsGetUser(productId, userId) {
    await delay(150);
    const db = readJson(REVIEWS_KEY, []);
    const pid = String(productId);
    const uid = String(userId);
    const r =
      (Array.isArray(db) ? db : []).find(
        (x) => String(x.productId) === pid && String(x.userId) === uid,
      ) || null;
    return { ok: true, review: r };
  },

  async reviewsUpsert({
    productId,
    userId,
    userName,
    userEmail,
    rating,
    message,
  }) {
    await delay(200);
    const db = readJson(REVIEWS_KEY, []);
    const pid = String(productId);
    const uid = String(userId);
    const now = Date.now();

    const arr = Array.isArray(db) ? db : [];
    const idx = arr.findIndex(
      (r) => String(r.productId) === pid && String(r.userId) === uid,
    );

    if (idx >= 0) {
      const updated = {
        ...arr[idx],
        userName,
        userEmail,
        rating,
        message,
        updatedAt: now,
      };
      const next = [...arr];
      next[idx] = updated;
      writeJson(REVIEWS_KEY, next);
      return { ok: true, review: updated };
    }

    const created = {
      id: now,
      productId: pid,
      userId: uid,
      userName,
      userEmail,
      rating,
      message,
      createdAt: now,
      updatedAt: now,
    };
    writeJson(REVIEWS_KEY, [created, ...arr]);
    return { ok: true, review: created };
  },

  async reviewsDelete(reviewId) {
    await delay(150);
    const db = readJson(REVIEWS_KEY, []);
    const rid = String(reviewId);
    const next = (Array.isArray(db) ? db : []).filter(
      (r) => String(r.id) !== rid,
    );
    writeJson(REVIEWS_KEY, next);
    return { ok: true };
  },

  async reviewsDeleteAllForProduct(productId) {
    await delay(200);
    const db = readJson(REVIEWS_KEY, []);
    const pid = String(productId);
    const next = (Array.isArray(db) ? db : []).filter(
      (r) => String(r.productId) !== pid,
    );
    writeJson(REVIEWS_KEY, next);
    return { ok: true };
  },
};
