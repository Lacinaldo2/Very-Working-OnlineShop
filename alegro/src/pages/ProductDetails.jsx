import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stan dla ilości (Wymóg: input ilości)
  const [quantity, setQuantity] = useState(1);

  // Stan dla opinii (Wymóg: dodawanie opinii)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "Jan Kowalski",
      rating: 5,
      text: "Świetny produkt, polecam!",
    },
    {
      id: 2,
      user: "Anna Nowak",
      rating: 4,
      text: "Dobra jakość, ale szybka dostawa.",
    },
  ]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1); // Reset ilości po dodaniu
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText) return alert("Wpisz treść opinii!");

    const newReview = {
      id: Date.now(),
      user: "Ty (Gość)", // Tutaj w przyszłości wstawimy nazwę zalogowanego usera
      rating: newRating,
      text: newReviewText,
    };

    setReviews([newReview, ...reviews]); // Dodajemy nową opinię na górę
    setNewReviewText(""); // Czyścimy formularz
    alert("Dziękujemy za opinię!");
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Ładowanie...</div>
    );

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
      {/* --- Sekcja Produktu --- */}
      <div
        style={{
          display: "flex",
          gap: "50px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{ maxWidth: "100%", maxHeight: "400px" }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <span
            style={{
              color: "#64748b",
              textTransform: "uppercase",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            {product.category}
          </span>
          <h1 style={{ marginTop: "10px", fontSize: "2rem" }}>
            {product.title}
          </h1>
          <p style={{ color: "#334155", lineHeight: "1.6" }}>
            {product.description}
          </p>

          <h2 style={{ color: "#3b82f6", fontSize: "2rem", margin: "20px 0" }}>
            {product.price} PLN
          </h2>

          {/* Kontrolki Ilości i Dodawania */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  padding: "10px 15px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                -
              </button>
              <span style={{ padding: "0 15px", fontWeight: "bold" }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  padding: "10px 15px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: "14px",
                background: "#1e293b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Dodaj do koszyka
            </button>
          </div>
        </div>
      </div>

      {/* --- Sekcja Opinii (Reviews) --- */}
      <div style={{ marginTop: "60px" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          Opinie o produkcie ({reviews.length})
        </h3>

        {/* Formularz dodawania opinii */}
        <div
          style={{
            background: "#f8fafc",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h4 style={{ margin: "0 0 15px 0" }}>Napisz opinię</h4>
          <form onSubmit={handleAddReview}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ marginRight: "10px" }}>Twoja ocena:</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setNewRating(star)}
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: star <= newRating ? "#fbbf24" : "#cbd5e1",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="Co sądzisz o tym produkcie?"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                minHeight: "80px",
                marginBottom: "10px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Wyślij opinię
            </button>
          </form>
        </div>

        {/* Lista opinii */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <strong>{review.user}</strong>
                <div style={{ color: "#fbbf24" }}>
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <p style={{ margin: 0, color: "#475569" }}>{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
