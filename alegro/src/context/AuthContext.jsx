import { createContext, useEffect, useState } from "react";
import { api } from "../mockServer/api";

export const AuthContext = createContext();

const SESSION_KEY = "user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.id) setUser(parsed);
    } catch {}
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const login = async (username, password) => {
    const res = await api.authLogin(username, password);
    if (!res.ok) return { success: false, message: res.error };
    setUser(res.user);
    return { success: true };
  };

  const register = async (username, password, name) => {
    const res = await api.authRegister({ username, password, name });
    if (!res.ok) return { success: false, message: res.error };
    setUser(res.user);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
