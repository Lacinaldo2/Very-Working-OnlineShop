import React from "react";

const CartLineItem = ({ item, onInc, onDec, onRemove }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        padding: "16px",
        borderRadius: "12px",
        background: "white",
        border: "1px solid #e2e8f0",
        alignItems: "center",
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        style={{ width: "80px", height: "80px", objectFit: "contain" }}
      />

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
          {item.title}
        </div>
        <div style={{ color: "#64748b", fontSize: "0.95rem" }}>
          Cena: <strong>{item.price} PLN</strong>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #cbd5e1",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <button
          onClick={onDec}
          style={{
            padding: "10px 14px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "1.1rem",
          }}
        >
          -
        </button>
        <div
          style={{
            padding: "0 14px",
            minWidth: "36px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {item.quantity}
        </div>
        <button
          onClick={onInc}
          style={{
            padding: "10px 14px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "1.1rem",
          }}
        >
          +
        </button>
      </div>

      <div style={{ minWidth: "130px", textAlign: "right" }}>
        <div style={{ color: "#64748b", fontSize: "0.9rem" }}>Suma</div>
        <div style={{ fontWeight: "bold" }}>
          {(item.price * item.quantity).toFixed(2)} PLN
        </div>
      </div>

      <button
        onClick={onRemove}
        style={{
          padding: "10px 14px",
          border: "none",
          borderRadius: "10px",
          background: "#ef4444",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Usuń
      </button>
    </div>
  );
};

export default CartLineItem;
