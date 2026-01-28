import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import ProductReviews from "../components/ProductReviews";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setQuantity(1);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Ładowanie...</div>
    );

  if (!product)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Nie znaleziono produktu.
      </div>
    );

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
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

      <ProductReviews productId={id} />
    </div>
  );
};

export default ProductDetails;
