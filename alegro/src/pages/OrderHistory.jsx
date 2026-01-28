import { useContext } from "react";
import { Link } from "react-router-dom";
import { OrderContext } from "../context/OrderContext";
import { AuthContext } from "../context/AuthContext";

const OrderHistory = () => {
  const { getUserOrders } = useContext(OrderContext);
  const { user } = useContext(AuthContext);

  const orders = getUserOrders();

  if (!user) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
        <h1>Historia Zamówień</h1>
        <p>Zaloguj się, aby zobaczyć historię.</p>
        <Link to="/login" style={{ fontWeight: "bold" }}>
          Przejdź do logowania
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1>Historia Zamówień</h1>

      {orders.length === 0 ? (
        <p style={{ color: "#666", marginTop: "20px" }}>
          Brak zamówień w historii.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "18px",
                background: "white",
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
                <div>
                  <div style={{ fontWeight: "bold", color: "#64748b" }}>
                    #{order.id}
                  </div>
                  <div style={{ color: "#94a3b8", marginTop: "4px" }}>
                    {order.date}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    Razem: {Number(order.total).toFixed(2)} PLN
                  </div>
                  <Link
                    to={`/history/${order.id}`}
                    style={{ fontWeight: "bold" }}
                  >
                    Szczegóły →
                  </Link>
                </div>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  color: "#64748b",
                  fontSize: "0.95rem",
                }}
              >
                Pozycji: <strong>{order.items.length}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
