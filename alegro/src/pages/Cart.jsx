import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, total, setCart } = useContext(CartContext); // Upewnij się, że masz setCart lub clearCart
  const { user } = useContext(AuthContext);
  const { addOrder } = useContext(OrderContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    // 1. Sprawdzenie czy użytkownik jest zalogowany (Wymóg 1.3)
    if (!user) {
      alert("Musisz być zalogowany, aby złożyć zamówienie!");
      navigate("/login");
      return;
    }

    // 2. Stworzenie zamówienia
    addOrder(cart, total);

    // 3. Wyczyszczenie koszyka
    setCart([]); // Resetujemy stan koszyka

    // 4. Przekierowanie do historii
    alert("Zamówienie przyjęte!");
    navigate("/history");
  };

  if (cart.length === 0)
    return (
      <h2 style={{ padding: "40px", textAlign: "center" }}>
        Twój koszyk jest pusty.
      </h2>
    );

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>Twój Koszyk</h1>
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr style={{ textAlign: "left" }}>
              <th style={{ padding: "15px" }}>Produkt</th>
              <th style={{ padding: "15px" }}>Cena</th>
              <th style={{ padding: "15px" }}>Ilość</th>
              <th style={{ padding: "15px" }}>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                <td
                  style={{
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <img
                    src={item.image}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />
                  {item.title.substring(0, 30)}...
                </td>
                <td style={{ padding: "15px" }}>{item.price} PLN</td>
                <td style={{ padding: "15px" }}>{item.quantity}</td>
                <td style={{ padding: "15px" }}>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      color: "red",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "30px", textAlign: "right" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          Suma: <span style={{ color: "#3b82f6" }}>{total.toFixed(2)} PLN</span>
        </h3>
        <button
          onClick={handleCheckout}
          style={{
            padding: "12px 30px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1.1rem",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Zapłać i Zamów
        </button>
      </div>
    </div>
  );
};

export default Cart;
