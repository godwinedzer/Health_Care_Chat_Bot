export const sendMessageToAPI = async (message: string): Promise<string> => {
  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message }), // 🔹 Correct key name
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.answer; // 🔹 Ensure this matches backend response key
  } catch (error) {
    console.error("Error:", error);
    return "⚠️ Unable to connect to chatbot!";
  }
};
