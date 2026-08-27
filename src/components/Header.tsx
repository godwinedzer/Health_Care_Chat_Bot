import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo_ch_new.jpg";
import "../cssFiles/Header.css";
import { logout } from "../services/authService";
import { User } from "firebase/auth";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );

  useEffect(() => {
    // ✅ Listen for login/logout changes
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : prevTheme === "dark" ? "solarized" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      document.body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  }

  const togglePage = () => {
    navigate(location.pathname === "/chatbot" ? "/diseases" : "/chatbot");
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage")); // ✅ Trigger storage event to update UI
    navigate("/login");
  };

  return (
    <header className="header">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="title">CHOPPER CHATBOT</h1>

      {user && (
        <div className="header-controls">
          <button className="toggle-btn" onClick={togglePage}>
            {location.pathname === "/chatbot" ? "🏥 Diseases List" : "💬 Chatbot"}
          </button>

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : theme === "dark" ? "🌞 Solarized Mode" : "💡 Light Mode"}
          </button>

          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      )}
    </header>
  );
};

export default Header;
