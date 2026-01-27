import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Pobranie pojedynczego produktu [cite: 24]
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <h2>Ładowanie...</h2>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "40px" }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: "300px" }}
        />
        <div>
          <h2>{product.title}</h2>
          <p style={{ color: "#555" }}>{product.description}</p>
          <h3>Cena: {product.price} PLN</h3>

          {/* Przycisk dodania do koszyka [cite: 31] */}
          <button
            onClick={() => addToCart(product)}
            style={{
              padding: "10px 20px",
              background: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Dodaj do koszyka
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
