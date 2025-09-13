
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock_key" });

const travelAssistantSystemInstruction = `You are 'Safeguard', a friendly and helpful AI assistant for travelers. 
Your goal is to provide concise, useful, and safe information. 
Keep your answers brief and to the point.
If asked about sensitive topics like personal safety, give cautious and general advice, e.g., 'Always be aware of your surroundings and keep your valuables secure.'
If asked for medical advice, tell the user to contact emergency services or a professional doctor immediately.
Do not engage in long, off-topic conversations.
Start your very first message with a warm welcome like 'Hello! I'm Safeguard, your personal travel assistant. How can I help you today?'`;


export const getBotResponse = async (
  prompt: string,
  isFirstMessage: boolean
): Promise<string> => {
  if (!process.env.API_KEY) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            "Thank you for your message. The AI assistant is currently in mock mode."
          ),
        1000
      )
    );
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: isFirstMessage ? travelAssistantSystemInstruction : undefined,
        },
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    return "Sorry, I'm having trouble connecting. Please try again later.";
  }
};