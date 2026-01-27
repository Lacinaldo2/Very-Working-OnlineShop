import { createContext, useState, useEffect } from "react";
import usersData from "../data/users.json"; // Importujemy naszą "bazę"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Sprawdzamy przy starcie, czy ktoś już jest zalogowany w przeglądarce
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username, password) => {
    // Szukamy użytkownika w pliku JSON
    const foundUser = usersData.find(
      (u) => u.username === username && u.password === password,
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser)); // Zapisz sesję
      return { success: true };
    } else {
      return { success: false, message: "Błędny login lub hasło" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Usuń sesję
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
