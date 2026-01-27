import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Navbar from "./components/Navbar"; // Zaraz go stworzymy

function App() {
  return (
    <BrowserRouter>
      {/* Navbar będzie widoczny na każdej podstronie */}
      <Navbar />

      <Routes>
        {/* Ścieżka "/" to strona główna [cite: 20] */}
        <Route path="/" element={<Home />} />

        {/* Ścieżka z parametrem ID dla konkretnego produktu [cite: 24] */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Koszyk [cite: 30] */}
        <Route path="/cart" element={<Cart />} />

        {/* Logowanie [cite: 26] */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
