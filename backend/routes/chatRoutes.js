const express = require("express");
const Chat = require("../models/chat");
const router = express.Router();

// POST: Save chat messages
router.post("/", async (req, res) => {
  try {
    const { userMessage, botReply } = req.body;
    const chat = new Chat({ userMessage, botReply });
    await chat.save();
    res.status(201).json({ message: "Chat saved successfully!", chat });
  } catch (err) {
    res.status(500).json({ error: "Error saving chat", details: err.message });
  }
});

// GET: Retrieve all chat messages (latest first)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination params
    const chats = await Chat.find()
      .sort({ createdAt: -1 }) // Latest messages first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Error fetching chats", details: err.message });
  }
});

// GET: Search chat messages using full-text search
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const results = await Chat.find({ $text: { $search: query } }).sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Error searching chats", details: err.message });
  }
});

module.exports = router;
