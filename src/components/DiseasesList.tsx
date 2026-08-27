import React, { useState, useEffect, useMemo } from "react";
import diseasesData from "../assets/diseases.json";
import "../cssFiles/DiseasesList.css";

// Define the structure of disease data
interface Disease {
  id: number;
  name: string;
  symptoms: string[];
  treatment: string[];
  home_remedy: string[];
}

const DiseasesList: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search input state
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Diseases Data Loaded:", diseasesData);
    setDiseases(diseasesData as Disease[]);
    setLoading(false); // Mark loading as false after setting data
  }, []);

  // Filter diseases based on search input
  const filteredDiseases = useMemo(() => {
    return diseases.filter((disease) =>
      disease?.name?.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ Optional Chaining
    );
  }, [searchTerm, diseases]);
  

  return (
    <div className="diseases-container">
      <h1 className="diseases-title">Disease Information</h1>

      {/* 🔍 Search Input for Filtering Diseases */}
      <input
        type="text"
        placeholder="Search disease..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 🕓 Loading Indicator */}
      {loading && <p className="loading-message">Loading diseases...</p>}

      {/* ❌ No Results Message */}
      {!loading && filteredDiseases.length === 0 && (
        <p className="no-results">No diseases found.</p>
      )}

      {/* 📜 Diseases List */}
      <div className="diseases-grid">
        {filteredDiseases.map((disease) => (
          <div key={disease.id} className="disease-card">
            <h2 className="disease-name">{disease.name}</h2>

            <div className="section">
              <h3>🆔 Disease ID: {disease.id}</h3>
            </div>

            <div className="section">
              <h3>🔍 Symptoms:</h3>
              <ul>
                {disease.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>

            <div className="section">
              <h3>💊 Treatment:</h3>
              <ul>
                {disease.treatment.map((treat, index) => (
                  <li key={index}>{treat}</li>
                ))}
              </ul>
            </div>

            <div className="section">
              <h3>🌿 Home Remedies:</h3>
              <ul>
                {disease.home_remedy.map((remedy, index) => (
                  <li key={index}>{remedy}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseasesList;
