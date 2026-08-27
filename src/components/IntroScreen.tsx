import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // ✅ Import navigation hook
import "../cssFiles/IntroScreen.css";

const IntroScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate(); // ✅ Get navigation function

  useEffect(() => {
    setTimeout(() => setFadeOut(true), 2500); // Start fade-out after 2.5s
    setTimeout(() => navigate("/login"), 3000); // ✅ Redirect after fade-out
  }, [navigate]);

  return (
    <div className={`intro-screen ${fadeOut ? "fade-out" : ""}`}>
      <h1 className="intro-text">AI-Based Health Chatbot</h1>
    </div>
  );
};

export default IntroScreen;
