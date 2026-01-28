import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { api } from "../mockServer/api";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const refreshMyOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    const res = await api.ordersForUser(user.username);
    setOrders(res.ok ? res.orders : []);
  }, [user]);

  useEffect(() => {
    refreshMyOrders();
  }, [refreshMyOrders]);

  const createOrder = useCallback(
    async (arg1, arg2) => {
      if (!user) return { ok: false, error: "Musisz być zalogowany." };

      let items = [];
      let total = 0;

      if (Array.isArray(arg1)) {
        items = arg1;
        total = Number(arg2) || 0;
      } else if (arg1 && typeof arg1 === "object") {
        items = arg1.items || [];
        total = Number(arg1.totalPrice ?? arg1.total ?? 0) || 0;
      }

      const res = await api.ordersCreate({ user, items, total });
      await refreshMyOrders();
      return res;
    },
    [user, refreshMyOrders],
  );

  const addOrder = useCallback(
    async (cartItems, total) => createOrder(cartItems, total),
    [createOrder],
  );

  const getUserOrders = useCallback(() => orders, [orders]);

  const getUserOrderById = useCallback(
    async (orderId) => {
      if (!user) return null;
      const res = await api.ordersGetById(orderId);
      const o = res.ok ? res.order : null;
      if (!o) return null;
      if (String(o.user) !== String(user.username)) return null;
      return o;
    },
    [user],
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        addOrder,
        getUserOrders,
        getUserOrderById,
        refreshMyOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
