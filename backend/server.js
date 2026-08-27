require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Ensure API key is available before starting the server
if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error("❌ Missing Hugging Face API Key in environment variables.");
}

app.use(express.json());
app.use(cors());

app.get("/chat", (req, res) => {
  res.send("This route only supports POST requests. Use Postman to send a POST request.");
});

app.get("/", (req, res) => {
  res.send("✅ Welcome to the Mistral Chatbot API!");
});

// 🔹 Chatbot Route
app.post("/chat", async (req, res) => {
    const { question } = req.body;

    if (!question || typeof question !== "string" || question.trim() === "") {
        return res.status(400).json({ error: "❌ Question is required and must be a valid string." });
    }

    try {
        const response = await axios.post(
            "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3",
            { inputs: question.trim() },
            {
                headers: {  
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
    
        console.log("🔍 API Response:", response.data); // Debugging

        // Ensure response is properly structured
        let answer = "🤔 I'm not sure how to respond.";
        if (response.data) {
            if (Array.isArray(response.data) && response.data.length > 0) {
                answer = response.data[0]?.generated_text || "🤔 No valid response.";
            } else if (typeof response.data === "object" && response.data.generated_text) {
                answer = response.data.generated_text;
            }
        }

        res.json({ answer });
    
    } catch (error) {
        console.error("❌ API Error:", error?.response?.data || error.message);
    
        res.status(error?.response?.status || 500).json({
            error: error?.response?.data?.error || "⚠️ Failed to get response from DeepSeek API. Try again later.",
        });
    }
});

// 🔹 Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
