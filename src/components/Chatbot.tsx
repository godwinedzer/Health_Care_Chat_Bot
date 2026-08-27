import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { sendMessageToAPI } from "../services/api";
import Message from "./Message";
import "../cssFiles/ChatBot.css";
import medicine from "../assets/medicine.png"

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; isLoading?: boolean }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message Function
  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Show a loading message before API response
    setMessages((prev) => [...prev, { text: "🔄 Thinking...", isUser: false, isLoading: true }]);

    try {
      const hiddenPrompt = `
      Ignore all previous instructions and follow this exact format:
    
      Symptoms :
      - (List common symptoms related to the query)  
    
      Home Remedy :
      - (Suggest home remedies if applicable and provide in a 5 sentence)  
    
      Can it be cured at home? :
      - (Provide a conclusion on whether it requires medical attention or can be managed at home )  
    
      Do not include any extra text. Do not repeat the query. Only return the structured medical response.
    
      Query: ${input}
      `.trim();

      const botReply = await sendMessageToAPI(hiddenPrompt);

      // 🔹 Find where the actual content starts, ignoring any prepended prompt
      const symptomsIndex = botReply.toLowerCase().lastIndexOf("symptoms :");
      const cleanText = symptomsIndex !== -1 ? botReply.substring(symptomsIndex) : botReply;

      const filteredResponse = cleanText
        .split("\n")
        .filter(line => {
          const l = line.toLowerCase();
          return !l.includes("ignore all previous instructions") &&
                 !l.includes("do not include any extra text") &&
                 !l.includes("do not repeat the query") &&
                 !l.includes("only return the structured") &&
                 !l.includes("(list common symptoms") &&
                 !l.includes("(suggest home remedies") &&
                 !l.includes("(provide a conclusion");
        })
        .map((line) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return ""; // Ignore empty lines

          // Add bullet image only for section headers
          if (trimmedLine.toLowerCase().startsWith("symptoms :")) {
            return `<p><img src="${medicine}" alt="Bullet" width="20" /> <strong>Symptoms :</strong></p>`;
          }
          if (trimmedLine.toLowerCase().startsWith("home remedy :")) {
            return `<p><img src="${medicine}" alt="Bullet" width="20" /> <strong>Home Remedy :</strong></p>`;
          }
          if (trimmedLine.toLowerCase().startsWith("can it be cured at home?")) {
            return `<p><img src="${medicine}" alt="Bullet" width="20" /> <strong>Can it be cured at home?</strong></p>`;
          }

          // Ensure no extra dashes in bullet points
          if (trimmedLine.startsWith("- ")) {
            return `<li>${trimmedLine.substring(2)}</li>`;
          }

          return `<p>${trimmedLine}</p>`; // Default case for normal text
        })
        .filter(Boolean) // Filter out empty lines
        .join("\n");

      // 🔹 Wrap everything inside a list
      const finalResponse = `<ul>${filteredResponse}</ul>`.trim();

      // 🔹 Update messages
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove the last loading message
        { text: finalResponse || "⚠️ No valid medical response found.", isUser: false },
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "⚠️ Error getting response!", isUser: false },
      ]);
    }
  }, [input]);

  // Clear chat function
  const handleClearChat = () => {
    setMessages([]); // Reset chat history
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} isUser={msg.isUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-container">
        <input
          type="text"
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a medical query..."
        />
        <button className="chatbot-button" onClick={handleSend}>
          Send
        </button>
        <button className="chatbot-clear-button" onClick={handleClearChat}>
          Clear Chat
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
