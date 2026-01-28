import React, { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext();

const STORAGE_KEY = "cart_v1";

const readCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const writeCart = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => readCart());

  useEffect(() => {
    writeCart(cartItems);
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const q = Math.max(1, Number(quantity) || 1);
    setCartItems((prev) => {
      const existing = prev.find((i) => String(i.id) === String(product.id));
      if (existing) {
        return prev.map((i) =>
          String(i.id) === String(product.id)
            ? { ...i, quantity: i.quantity + q }
            : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          image: product.image,
          quantity: q,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((i) => String(i.id) !== String(productId)),
    );
  };

  const setItemQuantity = (productId, nextQuantity) => {
    const q = Math.max(1, Number(nextQuantity) || 1);
    setCartItems((prev) =>
      prev.map((i) =>
        String(i.id) === String(productId) ? { ...i, quantity: q } : i,
      ),
    );
  };

  const incItem = (productId) => {
    setCartItems((prev) =>
      prev.map((i) =>
        String(i.id) === String(productId)
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    );
  };

  const decItem = (productId) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (String(i.id) !== String(productId)) return i;
        const q = Math.max(1, (Number(i.quantity) || 1) - 1);
        return { ...i, quantity: q };
      }),
    );
  };

  const clearCart = () => setCartItems([]);

  const totals = useMemo(() => {
    const itemsCount = cartItems.reduce(
      (s, i) => s + (Number(i.quantity) || 0),
      0,
    );
    const totalPrice = cartItems.reduce(
      (s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0),
      0,
    );
    return { itemsCount, totalPrice };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        setItemQuantity,
        incItem,
        decItem,
        clearCart,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
