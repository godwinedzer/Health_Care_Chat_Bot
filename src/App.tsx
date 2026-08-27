import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroScreen from "./components/IntroScreen";  // ✅ Import Intro Screen
import LoginSignup from "./components/Login";  
import Chatbot from "./components/Chatbot";
import Diseases from "./components/DiseasesList";
import Header from "./components/Header";
import Footer from "./components/Footer";  

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<IntroScreen />} />  {/* ✅ Show Intro First */}
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/diseases" element={<Diseases />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
