import { createContext, useState, useEffect } from "react";
import usersData from "../data/users.json";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Stan przechowujący wszystkich użytkowników (zaczynamy od pliku JSON, ale możemy dodawać nowych)
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Ładowanie sesji zalogowanego usera
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Ładowanie bazy użytkowników (jeśli były rejestracje, bierzemy z localStorage, jeśli nie - z JSON)
    const savedUsersDb = localStorage.getItem("users_db");
    if (savedUsersDb) {
      setAllUsers(JSON.parse(savedUsersDb));
    } else {
      setAllUsers(usersData);
    }
  }, []);

  const login = (username, password) => {
    const foundUser = allUsers.find(
      (u) => u.username === username && u.password === password,
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return { success: true };
    } else {
      return { success: false, message: "Błędny login lub hasło" };
    }
  };

  const register = (username, password, name) => {
    // Sprawdź czy user już istnieje
    const exists = allUsers.find((u) => u.username === username);
    if (exists) {
      return { success: false, message: "Taki użytkownik już istnieje!" };
    }

    const newUser = {
      id: Date.now(),
      username,
      password,
      name,
      role: "user",
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);

    // Zapisujemy nową bazę użytkowników w przeglądarce
    localStorage.setItem("users_db", JSON.stringify(updatedUsers));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
