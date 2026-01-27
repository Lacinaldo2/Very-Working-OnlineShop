import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Dodawanie do koszyka
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      // Sprawdzamy, czy produkt już jest w koszyku
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Jeśli jest, zwiększamy ilość
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      // Jeśli nie ma, dodajemy nowy
      return [...prevCart, { ...product, quantity }];
    });
    alert("Dodano do koszyka!");
  };

  // Usuwanie z koszyka [cite: 32]
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Obliczanie sumy [cite: 33]
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, total, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
