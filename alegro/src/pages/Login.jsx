import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // Do przekierowania po zalogowaniu

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);

    if (result.success) {
      navigate("/"); // Przekieruj na stronę główną
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        background: "white",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Zaloguj się</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Login (np. student1)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Hasło (np. 123)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Zaloguj
        </button>
      </form>

      <div style={{ marginTop: "20px", fontSize: "0.8rem", color: "#666" }}>
        <p>Dane testowe:</p>
        <ul>
          <li>student1 / 123</li>
          <li>admin / admin</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
