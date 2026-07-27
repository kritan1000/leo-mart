import { Request, Response, NextFunction } from "express";
import { GeminiService } from "../services/geminiService";

const geminiService = new GeminiService();

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatRequest {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export class ChatController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, history = [] } = req.body as ChatRequest;

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Message cannot be empty",
        });
      }

      if (message.length > 2000) {
        return res.status(400).json({
          success: false,
          message: "Message is too long. Maximum 2000 characters allowed.",
        });
      }

      const sanitizedMessage = message.trim();

      const conversationHistory = history.slice(-10).map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      const reply = await geminiService.chat([
        ...conversationHistory,
        { role: "user", content: sanitizedMessage },
      ]);

      console.log(`[Chat] User: "${sanitizedMessage.substring(0, 50)}..." -> AI responded`);

      return res.status(200).json({
        success: true,
        data: {
          reply,
          timestamp: Date.now(),
        },
      });
    } catch (error: any) {
      console.error("[Chat Error]", error?.message || error);

      if (error?.status === 401) {
        return res.status(500).json({
          success: false,
          message: "AI service configuration error. Please contact support.",
        });
      }

      if (error?.status === 429) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please wait a moment and try again.",
        });
      }

      if (error?.code === "ECONNREFUSED" || error?.code === "ENOTFOUND") {
        return res.status(503).json({
          success: false,
          message: "AI service is temporarily unavailable. Please try again later.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }
}
