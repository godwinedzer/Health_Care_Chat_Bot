require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const API_URL = "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3";

if (!HUGGINGFACE_API_KEY) {
  throw new Error("❌ Missing Hugging Face API Key in environment variables.");
}

// Predefined ignored inputs (Non-medical greetings)
const IGNORED_PATTERNS = [
  /^\s*hello[!.,;]?\s*$/i,
  /^\s*hi[!.,;]?\s*$/i,
  /^\s*hey[!.,;]?\s*$/i,
  /^\s*who\s+are\s+you\??\s*$/i,
  /^\s*what'?s\s+up\??\s*$/i,
  /^\s*how\s+are\s+you\??\s*$/i,
  /^\s*good\s+(morning|evening|afternoon)[!.,;]?\s*$/i
];

// Allowed medical keywords
const MEDICAL_KEYWORDS = [
  "symptom", "pain", "treatment", "fever", "cough", "headache", "ache", "injury",
  "medicine", "remedy", "allergy", "sore", "flu", "blurred vision", "migraine", 
  "infection", "rash", "swelling", "dizziness", "nausea", "fatigue", "sneezing",
  "cold", "throat", "burning", "pressure"
];

const getMistralResponse = async (userInput) => {
  if (!userInput || typeof userInput !== "string" || userInput.trim() === "") {
    return "⚠️ A valid medical question is required.";
  }

  userInput = userInput.trim();

  // Block non-medical/greeting queries
  if (IGNORED_PATTERNS.some((pattern) => pattern.test(userInput))) {
    return "🤖 I'm here for medical advice. Please enter symptoms.";
  }

  // Check if input contains medical keywords
  const isMedicalInput = MEDICAL_KEYWORDS.some(keyword => userInput.toLowerCase().includes(keyword));
  if (!isMedicalInput) {
    return "⚠️ Please enter a valid medical query.";
  }

  // 🔹 Merge hidden instructions with user input
  const prompt = `You are a medical AI assistant. Respond in exactly 20 words or less with causes and home remedies.

  STRICT FORMAT:
  1. Cause: Short (max 10 words).
  2. Cause: Short (max 10 words).
  3. Cause: Short (max 10 words).

  1. Remedy: Short (max 10 words).
  2. Remedy: Short (max 10 words).
  3. Remedy: Short (max 10 words).

  RULES:
  ❌ NO extra text.
  ❌ NO alternative formats.
  ❌ If input is non-medical, respond ONLY with:
    "⚠️ Please enter a valid medical query."

  ### Symptoms:
  ${userInput}

  ### Response:
  `.trim();

  try {
    const response = await axios.post(
      API_URL,
      {
        inputs: prompt,
        parameters: { max_new_tokens: 50, temperature: 0.1 },
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🔍 API Response:", response.data); // Debugging

    let answer = response?.data?.generated_text || response?.data?.[0]?.generated_text || "🤔 No advice available.";

    // Limit response to 20 words
    answer = answer.split(" ").slice(0, 20).join(" ");

    return answer || "⚠️ No valid medical causes or remedies found.";
  } catch (error) {
    console.error("❌ API Error:", error?.response?.data || error.message);
    return "⚠️ Failed to get a response from the medical AI.";
  }
};

app.post("/chat", async (req, res) => {
  const userInput = req.body.question;
  const response = await getMistralResponse(userInput);
  res.json({ answer: response });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
