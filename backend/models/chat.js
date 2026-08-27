const mongoose = require("mongoose");

// Chat Schema
const chatSchema = new mongoose.Schema(
  {
    userMessage: { type: String, required: true, trim: true },
    botReply: { type: String, required: true, trim: true }
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Indexing `createdAt` for faster queries
chatSchema.index({ createdAt: 1 });

// Full-text search for user messages & bot replies
chatSchema.index({ userMessage: "text", botReply: "text" });

// Auto-delete messages after 30 days (optional)
chatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); 

module.exports = mongoose.model("Chat", chatSchema);
