import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  // Ładowanie historii z localStorage przy starcie
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Dodawanie nowego zamówienia
  const addOrder = (cartItems, total) => {
    const newOrder = {
      id: Date.now(), // Unikalne ID na podstawie czasu
      date: new Date().toLocaleString(),
      items: cartItems,
      total: total,
      user: user ? user.username : "guest", // Przypisanie zamówienia do użytkownika
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders)); // Zapis do pamięci przeglądarki
  };

  // Pobieranie zamówień tylko dla aktualnie zalogowanego użytkownika
  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter((order) => order.user === user.username);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getUserOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
