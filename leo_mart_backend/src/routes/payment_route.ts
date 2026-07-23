import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();

// Khalti ePayment v2 Routes
router.post("/khalti/initiate", PaymentController.initiateKhalti);
router.post("/khalti/verify", PaymentController.verifyKhalti);

// Alternative path support
router.post("/verify-khalti", PaymentController.verifyKhalti);

export default router;
