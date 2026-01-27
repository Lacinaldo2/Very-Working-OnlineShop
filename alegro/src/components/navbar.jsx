import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        display: "flex",
        gap: "20px",
      }}
    >
      <Link to="/">Sklep (Home)</Link>
      <Link to="/cart">Koszyk</Link>
      <Link to="/login">Zaloguj</Link>
    </nav>
  );
};

export default Navbar;
