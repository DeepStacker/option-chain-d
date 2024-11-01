import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import OptionChain from "./pages/OptionChain";
import Footer from "./pages/Footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Blog from "./pages/Blog";

const App = () => {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    // Dynamically update the body class based on the theme
    document.body.className =
      theme === "dark" ? "bg-gray-950 text-gray-300" : "bg-white text-gray-700";
  }, [theme]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/advanced-option-chain" element={<OptionChain />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
