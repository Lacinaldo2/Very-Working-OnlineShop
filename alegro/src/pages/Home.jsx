import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all' lub nazwa kategorii
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pobieramy produkty I kategorie równolegle
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("https://fakestoreapi.com/products"),
          fetch("https://fakestoreapi.com/products/categories"),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        console.error("Błąd pobierania:", err);
      }
    };

    fetchData();
  }, []);

  // Logika filtrowania (Search + Kategoria)
  const filteredProducts = products.filter((product) => {
    const matchesCategory = filter === "all" || product.category === filter;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading)
    return (
      <div
        style={{ textAlign: "center", marginTop: "50px", fontSize: "1.5rem" }}
      >
        ⏳ Ładowanie sklepu...
      </div>
    );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* --- Sekcja Hero / Nagłówek --- */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          Witaj w FakeStore
        </h1>
        <p style={{ color: "#64748b" }}>
          Najlepsze produkty w wirtualnym świecie
        </p>

        {/* Wyszukiwarka */}
        <input
          type="text"
          placeholder="Szukaj produktu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px 20px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "25px",
            border: "1px solid #ddd",
            fontSize: "1rem",
            marginTop: "20px",
          }}
        />
      </div>

      {/* --- Pasek Kategorii --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: filter === "all" ? "#3b82f6" : "#e2e8f0",
            color: filter === "all" ? "white" : "#475569",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Wszystkie
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              background: filter === cat ? "#3b82f6" : "#e2e8f0",
              color: filter === cat ? "white" : "#475569",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- Siatka Produktów --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "30px",
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            style={{
              border: "1px solid #f1f5f9",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "20px",
                background: "white",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{ height: "160px", objectFit: "contain" }}
              />
            </div>

            <div
              style={{
                padding: "20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                {product.category}
              </span>
              <h3 style={{ margin: "10px 0", fontSize: "1.1rem", flex: 1 }}>
                {product.title}
              </h3>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "15px",
                }}
              >
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#3b82f6",
                  }}
                >
                  {product.price} PLN
                </span>
                <Link to={`/product/${product.id}`}>
                  <button
                    style={{
                      padding: "8px 16px",
                      background: "#1e293b",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Zobacz
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div
          style={{ textAlign: "center", color: "#94a3b8", marginTop: "20px" }}
        >
          Nie znaleziono produktów pasujących do wyszukiwania.
        </div>
      )}
    </div>
  );
};

export default Home;
