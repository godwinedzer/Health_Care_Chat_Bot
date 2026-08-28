import React, { useState, useEffect } from "react";
import { login, signUp, logout } from "../services/authService";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../cssFiles/Login.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

const LoginSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Listen for authentication changes
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        localStorage.setItem("user", JSON.stringify(authUser)); // ✅ Store user
        window.dispatchEvent(new Event("storage")); // ✅ Trigger UI update
        navigate("/chatbot"); // ✅ Navigate to chatbot
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const authUser = isLogin ? await login(email, password) : await signUp(email, password);
      setUser(authUser);
      if (authUser) {
        localStorage.setItem("user", JSON.stringify(authUser)); // ✅ Store user instantly
        window.dispatchEvent(new Event("storage")); // ✅ Trigger UI update
        navigate("/chatbot"); // ✅ Navigate instantly
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage")); // ✅ Update UI instantly
    navigate("/login");
  };

  return (
    <div className="login-container">
      {user ? (
        <div>
          <button className="login-button" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          <form onSubmit={handleAuth} className="login-form">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="login-input" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="login-input" />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">{isLogin ? "Login" : "Sign Up"}</button>
          </form>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="link-button" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Sign Up" : "Login"}</button>
          </p>
        </>
      )}
    </div>
  );
};

export default LoginSignup;
