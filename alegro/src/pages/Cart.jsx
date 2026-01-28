import React, { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext";
import CartLineItem from "../components/CartLineItem";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, incItem, decItem, totals, clearCart } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { createOrder } = useContext(OrderContext);

  const isEmpty = cartItems.length === 0;

  const summaryLines = useMemo(() => {
    return cartItems.map((i) => ({
      id: i.id,
      title: i.title,
      quantity: i.quantity,
      price: i.price,
      lineTotal: (i.price * i.quantity).toFixed(2),
    }));
  }, [cartItems]);

  if (!user) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Koszyk</h2>
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            padding: "16px",
            borderRadius: "12px",
            color: "#9a3412",
          }}
        >
          Musisz być zalogowany, aby korzystać z koszyka i złożyć zamówienie.
          <div style={{ marginTop: "10px" }}>
            <Link to="/login" style={{ fontWeight: "bold" }}>
              Przejdź do logowania
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const placeOrder = () => {
    if (isEmpty) return;

    createOrder({
      items: cartItems,
      totalPrice: totals.totalPrice,
    });
    clearCart();
    navigate("/history");
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Koszyk</h2>
        {!isEmpty && (
          <button
            onClick={clearCart}
            style={{
              padding: "10px 14px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              height: "fit-content",
            }}
          >
            Wyczyść koszyk
          </button>
        )}
      </div>

      {isEmpty ? (
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "20px",
            color: "#475569",
          }}
        >
          Koszyk jest pusty.{" "}
          <Link to="/" style={{ fontWeight: "bold" }}>
            Wróć do zakupów
          </Link>
          .
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
            {cartItems.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                onInc={() => incItem(item.id)}
                onDec={() => decItem(item.id)}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </div>

          <div
            style={{
              marginTop: "22px",
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "18px",
              display: "grid",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Liczba produktów</span>
              <strong>{totals.itemsCount}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Wartość koszyka</span>
              <strong>{totals.totalPrice.toFixed(2)} PLN</strong>
            </div>

            <div
              style={{ height: "1px", background: "#e2e8f0", margin: "6px 0" }}
            />

            <button
              onClick={placeOrder}
              style={{
                padding: "14px",
                background: "#1e293b",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Złóż zamówienie
            </button>

            <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Po złożeniu zamówienia zostaniesz przeniesiony do historii
              zamówień.
            </div>

            <details style={{ marginTop: "8px" }}>
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                Podgląd listy zakupów
              </summary>
              <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
                {summaryLines.map((l) => (
                  <div
                    key={l.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      border: "1px solid #f1f5f9",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold" }}>{l.title}</div>
                      <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                        Ilość: {l.quantity} · Cena: {l.price} PLN
                      </div>
                    </div>
                    <div style={{ fontWeight: "bold" }}>{l.lineTotal} PLN</div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
