const express = require("express");
const { getChatResponse } = require("../services/MistralService");

const router = express.Router();

router.post("/symptom-checker", async (req, res) => {
  try {
    let { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: "Invalid input: symptoms must be a non-empty array." });
    }

    // Trim and sanitize symptoms
    const sanitizedSymptoms = symptoms.map(symptom =>
      typeof symptom === "string" ? symptom.trim() : symptom
    );

    // Create a formatted AI prompt with additional instructions
    const prompt = `${sanitizedSymptoms.join(", ")}.\n\nProvide only treatment advice, remedies, and precautions in 2 lines. No extra text.`;

    let diagnosis;
    try {
      diagnosis = await getChatResponse(prompt);
    } catch (apiError) {
      return res.status(502).json({ error: "Failed to retrieve AI-generated response. Please try again." });
    }

    res.json({ diagnosis });
  } catch (error) {
    console.error("❌ Symptom Checker Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
