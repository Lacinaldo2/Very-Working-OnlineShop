const STORAGE_KEY = "reviews_db_v1";

const readDb = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const writeDb = (rows) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
};

export const getReviewsForProduct = (productId) => {
  const pid = String(productId);
  return readDb()
    .filter((r) => String(r.productId) === pid)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const getUserReviewForProduct = (productId, userId) => {
  const pid = String(productId);
  const uid = String(userId);
  return (
    readDb().find(
      (r) => String(r.productId) === pid && String(r.userId) === uid,
    ) || null
  );
};

export const upsertReview = ({
  productId,
  userId,
  userName,
  userEmail,
  rating,
  message,
}) => {
  const pid = String(productId);
  const uid = String(userId);
  const db = readDb();
  const idx = db.findIndex(
    (r) => String(r.productId) === pid && String(r.userId) === uid,
  );
  const now = Date.now();

  if (idx >= 0) {
    const updated = {
      ...db[idx],
      userName,
      userEmail,
      rating,
      message,
      updatedAt: now,
    };
    const next = [...db];
    next[idx] = updated;
    writeDb(next);
    return updated;
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
  writeDb([created, ...db]);
  return created;
};

export const deleteReview = (reviewId) => {
  const rid = String(reviewId);
  const db = readDb();
  const next = db.filter((r) => String(r.id) !== rid);
  writeDb(next);
};

export const deleteAllReviewsForProduct = (productId) => {
  const pid = String(productId);
  const db = readDb();
  const next = db.filter((r) => String(r.productId) !== pid);
  writeDb(next);
};
