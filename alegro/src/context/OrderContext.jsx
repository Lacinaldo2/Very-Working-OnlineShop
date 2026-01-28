import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { AuthContext } from "./AuthContext";

export const OrderContext = createContext();

const STORAGE_KEY = "orders";

const readOrders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const writeOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setOrders(readOrders());
  }, []);

  const persist = (next) => {
    setOrders(next);
    writeOrders(next);
  };

  const addOrder = useCallback(
    (cartItems, total) => {
      const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: Array.isArray(cartItems) ? cartItems : [],
        total: Number(total) || 0,
        user: user ? user.username : "guest",
      };

      const next = [newOrder, ...orders];
      persist(next);
      return newOrder;
    },
    [orders, user],
  );

  // alias pod Cart.jsx z Twojej wersji (createOrder)
  // obsługuje 2 style:
  // 1) createOrder(cartItems, total)
  // 2) createOrder({ items, totalPrice })
  const createOrder = useCallback(
    (arg1, arg2) => {
      if (Array.isArray(arg1)) return addOrder(arg1, arg2);
      if (arg1 && typeof arg1 === "object") {
        const items = arg1.items || [];
        const totalPrice = arg1.totalPrice ?? arg1.total ?? 0;
        return addOrder(items, totalPrice);
      }
      return addOrder([], 0);
    },
    [addOrder],
  );

  const getUserOrders = useCallback(() => {
    if (!user) return [];
    return orders.filter((o) => o.user === user.username);
  }, [orders, user]);

  const getUserOrderById = useCallback(
    (orderId) => {
      if (!user) return null;
      const o = orders.find((x) => String(x.id) === String(orderId)) || null;
      if (!o) return null;
      if (o.user !== user.username) return null;
      return o;
    },
    [orders, user],
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        createOrder,
        getUserOrders,
        getUserOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
