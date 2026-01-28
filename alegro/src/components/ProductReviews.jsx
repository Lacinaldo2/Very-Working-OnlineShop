import { useEffect, useMemo, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  deleteAllReviewsForProduct,
  deleteReview,
  getReviewsForProduct,
  getUserReviewForProduct,
  upsertReview,
} from "../services/reviewsDb";

const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Stars = ({ value, onChange, size = "1.5rem" }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: "4px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => onChange(s)}
          style={{ fontSize: size, color: s <= value ? "#fbbf24" : "#cbd5e1" }}
          aria-label={`${s} gwiazdek`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onChange(s);
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ProductReviews = ({ productId }) => {
  const { user } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [mode, setMode] = useState("create");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  const userReview = useMemo(() => {
    if (!user) return null;
    return getUserReviewForProduct(productId, user.id);
  }, [productId, user]);

  const refresh = () => {
    setReviews(getReviewsForProduct(productId));
  };

  useEffect(() => {
    refresh();
  }, [productId]);

  useEffect(() => {
    if (!user) {
      setMode("create");
      setEmail("");
      setMessage("");
      setRating(5);
      setError("");
      return;
    }

    if (userReview) {
      setMode("edit");
      setEmail(userReview.userEmail || "");
      setMessage(userReview.message || "");
      setRating(userReview.rating || 5);
    } else {
      setMode("create");
      setEmail("");
      setMessage("");
      setRating(5);
    }
    setError("");
  }, [user, userReview]);

  const validate = () => {
    if (!user) return "Zaloguj się, aby dodać opinię.";
    if (!emailOk(email)) return "Podaj poprawny e-mail.";
    if (!message.trim()) return "Wpisz treść opinii.";
    if (message.trim().length < 10)
      return "Treść opinii musi mieć co najmniej 10 znaków.";
    if (rating < 1 || rating > 5) return "Wybierz ocenę 1–5.";
    return "";
  };

  const submit = (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    upsertReview({
      productId,
      userId: user.id,
      userName: user.name || user.username,
      userEmail: email.trim(),
      rating,
      message: message.trim(),
    });

    refresh();
    setError("");
    setMode("edit");
  };

  const removeMine = () => {
    if (!userReview) return;
    deleteReview(userReview.id);
    refresh();
    setMode("create");
    setEmail("");
    setMessage("");
    setRating(5);
    setError("");
  };

  const removeAny = (reviewId) => {
    deleteReview(reviewId);
    refresh();
  };

  const removeAll = () => {
    deleteAllReviewsForProduct(productId);
    refresh();
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          Opinie o produkcie ({reviews.length})
        </h3>
        {isAdmin && reviews.length > 0 && (
          <button
            onClick={removeAll}
            style={{
              padding: "8px 12px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Usuń wszystkie opinie
          </button>
        )}
      </div>

      <div
        style={{
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h4 style={{ margin: "0 0 15px 0" }}>
          {user
            ? mode === "edit"
              ? "Edytuj swoją opinię"
              : "Napisz opinię"
            : "Zaloguj się, aby dodać opinię"}
        </h4>

        {!user ? (
          <div style={{ color: "#475569" }}>
            Aby dodać opinię, przejdź do <Link to="/login">logowania</Link>.
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "grid", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span>Ocena:</span>
                <Stars value={rating} onChange={setRating} />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flex: 1,
                  minWidth: "240px",
                }}
              >
                <label htmlFor="reviewEmail" style={{ whiteSpace: "nowrap" }}>
                  E-mail:
                </label>
                <input
                  id="reviewEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="np. jan.kowalski@example.com"
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                  }}
                />
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Twoja opinia (min. 10 znaków)"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                minHeight: "90px",
              }}
            />

            {error && (
              <div style={{ color: "#ef4444", fontWeight: "bold" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 18px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {mode === "edit" ? "Zapisz zmiany" : "Wyślij opinię"}
              </button>

              {mode === "edit" && (
                <button
                  type="button"
                  onClick={removeMine}
                  style={{
                    padding: "10px 18px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Usuń moją opinię
                </button>
              )}
            </div>

            {userReview && (
              <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                Możesz dodać tylko jedną opinię do produktu. Zamiast tego
                edytujesz istniejącą.
              </div>
            )}
          </form>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {reviews.length === 0 && (
          <div style={{ color: "#475569" }}>Brak opinii. Bądź pierwszy!</div>
        )}

        {reviews.map((r) => {
          const isMine = user && String(r.userId) === String(user.id);
          return (
            <div
              key={r.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "grid", gap: "2px" }}>
                  <strong>{r.userName}</strong>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    {r.userEmail}
                  </span>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div style={{ color: "#fbbf24", fontSize: "1.1rem" }}>
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>

                  {isAdmin && !isMine && (
                    <button
                      onClick={() => removeAny(r.id)}
                      style={{
                        padding: "8px 12px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Usuń
                    </button>
                  )}
                </div>
              </div>

              <p
                style={{
                  margin: "12px 0 0 0",
                  color: "#475569",
                  lineHeight: 1.6,
                }}
              >
                {r.message}
              </p>

              <div
                style={{
                  marginTop: "10px",
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                }}
              >
                {r.updatedAt && r.updatedAt !== r.createdAt
                  ? "Zaktualizowano: "
                  : "Dodano: "}
                {new Date(r.updatedAt || r.createdAt).toLocaleString()}
                {isMine && (
                  <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                    Twoja opinia
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductReviews;
