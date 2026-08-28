import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // ✅ Ensure API key is available before starting the server
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error("❌ Missing Hugging Face API Key in environment variables.");
  }

  app.use(express.json());
  app.use(cors());

  // 🔹 Chatbot Route
  app.post("/api/chat", async (req, res) => {
    const { question } = req.body;

    if (!question || typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({ error: "❌ Question is required and must be a valid string." });
    }

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct",
        { inputs: question.trim() },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🔍 API Response:", response.data);

      let answer = "🤔 I'm not sure how to respond.";
      if (Array.isArray(response.data) && response.data.length > 0) {
        answer = response.data[0]?.generated_text || "🤔 No valid response.";
      } else if (typeof response.data === "object" && response.data.generated_text) {
        answer = response.data.generated_text;
      }

      res.json({ answer });

    } catch (error: any) {
      console.error("❌ API Error [Details]:", error.response?.data || error.message);
      res.status(500).json({
        error: error.response?.data?.error || error.message || "Unknown error",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
