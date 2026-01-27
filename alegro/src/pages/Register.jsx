import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !name) {
      setError("Wypełnij wszystkie pola!");
      return;
    }

    const result = register(username, password, name);

    if (result.success) {
      alert("Konto założone! Możesz się zalogować.");
      navigate("/login");
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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Załóż konto</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Imię i Nazwisko"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          placeholder="Login"
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
          placeholder="Hasło"
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
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Zarejestruj się
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Masz już konto?{" "}
        <Link to="/login" style={{ color: "#3b82f6" }}>
          Zaloguj się
        </Link>
      </p>
    </div>
  );
};

export default Register;
