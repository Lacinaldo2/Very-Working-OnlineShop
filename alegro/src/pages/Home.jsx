import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pobieranie wszystkich produktów
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Ładowanie produktów...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista Produktów</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <img
              src={product.image}
              alt={product.title}
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
            <h3>{product.title}</h3>
            <p>{product.price} PLN</p>
            {/* Link do detali produktu */}
            <Link to={`/product/${product.id}`}>
              <button style={{ cursor: "pointer", padding: "5px 10px" }}>
                Szczegóły
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
