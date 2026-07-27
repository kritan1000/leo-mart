import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  role: "system" | "user" | "assistant";
  content: string;
}

export class OpenAIService {
  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 1024,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error: any) {
      console.error("[OpenAI Error]", error?.message || error);
      throw error;
    }
  }
}
