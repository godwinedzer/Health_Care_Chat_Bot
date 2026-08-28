export const sendMessageToAPI = async (message: string): Promise<string> => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message }), // 🔹 Correct key name
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.answer; // 🔹 Ensure this matches backend response key
  } catch (error: any) {
    console.error("Error:", error);
    throw error;
  }
};
