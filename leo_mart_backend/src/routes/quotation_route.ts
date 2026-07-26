import { Router } from "express";
import { QuotationController } from "../controllers/quotation.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const quotationController = new QuotationController();
const router = Router();

// Public route to submit quotation inquiry
router.post("/", quotationController.create.bind(quotationController));

// Admin only routes to fetch and update status
router.get("/", authMiddleware, adminMiddleware, quotationController.getQuotations.bind(quotationController));
router.put("/:id", authMiddleware, adminMiddleware, quotationController.updateStatus.bind(quotationController));

export default router;
