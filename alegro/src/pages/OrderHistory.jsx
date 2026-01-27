import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";
import { AuthContext } from "../context/AuthContext";

const OrderHistory = () => {
  const { getUserOrders } = useContext(OrderContext);
  const { user } = useContext(AuthContext);

  const orders = getUserOrders();

  if (!user)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Zaloguj się, aby zobaczyć historię.
      </div>
    );

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>Historia Zamówień</h1>
      <p>Witaj, {user.name}! Oto Twoje zakupy:</p>

      {orders.length === 0 ? (
        <p style={{ color: "#666", marginTop: "20px" }}>
          Brak zamówień w historii.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "20px",
                background: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#64748b" }}>
                  #{order.id}
                </span>
                <span style={{ color: "#94a3b8" }}>{order.date}</span>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                    }}
                  >
                    <span>
                      {item.quantity}x {item.title.substring(0, 40)}...
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} PLN</span>
                  </li>
                ))}
              </ul>

              <div
                style={{
                  textAlign: "right",
                  marginTop: "15px",
                  paddingTop: "10px",
                  borderTop: "1px dashed #eee",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                Razem: {order.total.toFixed(2)} PLN
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
