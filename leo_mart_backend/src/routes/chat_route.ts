import { Router } from "express";
import { ChatController } from "../controllers/chatController";

const chatController = new ChatController();
const router = Router();

router.post("/", chatController.sendMessage.bind(chatController));

export default router;
