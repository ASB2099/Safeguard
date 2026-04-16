import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function testKey() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Testing Key:", key ? `${key.substring(0, 5)}...` : "MISSING");
  
  if (!key) return;

  const genAI = new GoogleGenAI({ apiKey: key });
  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Hi",
  });

  try {
    console.log("SUCCESS: Response text:", response.text);
    console.log("SUCCESS: Key is working!");
  } catch (error: any) {
    console.log("FAILED Status Code:", error.status);
    console.log("FAILED Message:", error.message);
  }
}

testKey();
