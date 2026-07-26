import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { optionalAuthMiddleware, authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Khalti ePayment v2 Routes
router.post("/khalti/initiate", optionalAuthMiddleware, PaymentController.initiateKhalti);
router.post("/khalti/verify", optionalAuthMiddleware, PaymentController.verifyKhalti);

// Alternative path support
router.post("/verify-khalti", optionalAuthMiddleware, PaymentController.verifyKhalti);

export default router;
