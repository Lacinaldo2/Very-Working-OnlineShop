import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, total } = useContext(CartContext);

  if (cart.length === 0)
    return <h2 style={{ padding: "20px" }}>Twój koszyk jest pusty.</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Twój Koszyk</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
            <th>Produkt</th>
            <th>Cena</th>
            <th>Ilość</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>{item.title}</td>
              <td>{item.price} PLN</td>
              <td>{item.quantity}</td>
              <td>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ color: "red", cursor: "pointer" }}
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Przeliczanie zawartości [cite: 33] */}
      <h3 style={{ marginTop: "20px", textAlign: "right" }}>
        Suma całkowita: {total.toFixed(2)} PLN
      </h3>
      <button
        style={{
          float: "right",
          padding: "10px",
          background: "blue",
          color: "white",
        }}
      >
        Akceptuj koszyk
      </button>
    </div>
  );
};

export default Cart;
