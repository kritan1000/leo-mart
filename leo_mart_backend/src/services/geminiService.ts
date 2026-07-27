import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `You are the AI customer support assistant for LeoMart, a Nepali Grocery Marketplace. 
Answer questions professionally, politely, and accurately. 
Help users understand products, services, payments, orders, delivery, and general website information.
You can help with:
- Product information and recommendations
- Order status and delivery questions
- Payment methods (Cash on Delivery and Khalti)
- Wholesale/bulk ordering and quotations
- Account and profile management
- General website navigation
- Returns and refund policies
- Loyalty points system
Keep responses concise and helpful. If you don't know something specific, politely say so and suggest contacting support.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class GeminiService {
  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const contents = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      });

      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error: any) {
      console.error("[Gemini Error]", error?.message || error);
      throw error;
    }
  }
}
