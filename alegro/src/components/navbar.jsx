import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const cartCtx = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const cartItems = cartCtx?.cartItems ?? [];

  const cartCount = cartItems.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0),
    0,
  );

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        background: "white",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#1e293b",
          textDecoration: "none",
        }}
      >
        Alegro
      </Link>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#64748b" }}>
          Sklep
        </Link>

        <Link
          to="/cart"
          style={{
            textDecoration: "none",
            color: "#64748b",
            position: "relative",
          }}
        >
          Koszyk
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-12px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "0.7rem",
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>

        {user && (
          <Link
            to="/history"
            style={{
              marginRight: "15px",
              textDecoration: "none",
            }}
          >
            Moje Zamówienia
          </Link>
        )}

        {user ? (
          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              borderLeft: "1px solid #ddd",
              paddingLeft: "20px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#3b82f6" }}>
              {user.name}
            </span>
            <button
              onClick={logout}
              style={{
                background: "none",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Wyloguj
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Zaloguj
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
