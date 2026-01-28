import { useContext, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useContext(AuthContext);
  const { getUserOrderById } = useContext(OrderContext);

  const order = useMemo(() => {
    if (!user) return null;
    return getUserOrderById(orderId);
  }, [user, orderId, getUserOrderById]);

  if (!user) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
        <h1>Szczegóły zamówienia</h1>
        <p>Zaloguj się, aby zobaczyć szczegóły.</p>
        <Link to="/login" style={{ fontWeight: "bold" }}>
          Przejdź do logowania
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
        <h1>Szczegóły zamówienia</h1>
        <p>Nie znaleziono zamówienia lub nie masz do niego dostępu.</p>
        <Link to="/history" style={{ fontWeight: "bold" }}>
          Wróć do historii
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Zamówienie #{order.id}</h1>
          <div style={{ color: "#64748b", marginTop: "6px" }}>{order.date}</div>
        </div>
        <Link
          to="/history"
          style={{ fontWeight: "bold", height: "fit-content" }}
        >
          ← Wróć do historii
        </Link>
      </div>

      <div
        style={{
          marginTop: "18px",
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
        }}
      >
        <div
          style={{ padding: "16px", background: "#f8fafc", fontWeight: "bold" }}
        >
          Produkty w zamówieniu
        </div>

        <div style={{ display: "grid", gap: "10px", padding: "16px" }}>
          {order.items.map((item, idx) => (
            <div
              key={item.id ?? idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                border: "1px solid #f1f5f9",
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "12px",
                    background: "#f1f5f9",
                  }}
                />
              )}

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>{item.title}</div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.95rem",
                    marginTop: "4px",
                  }}
                >
                  Ilość: <strong>{item.quantity}</strong> · Cena:{" "}
                  <strong>{Number(item.price).toFixed(2)} PLN</strong>
                </div>
              </div>

              <div style={{ minWidth: "140px", textAlign: "right" }}>
                <div style={{ color: "#64748b", fontSize: "0.9rem" }}>Suma</div>
                <div style={{ fontWeight: "bold" }}>
                  {(Number(item.price) * Number(item.quantity)).toFixed(2)} PLN
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          <span>Razem</span>
          <span>{Number(order.total).toFixed(2)} PLN</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
