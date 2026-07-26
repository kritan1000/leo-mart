import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { optionalAuthMiddleware, authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/cod", optionalAuthMiddleware, OrderController.createCodOrder);
router.get("/user", authMiddleware, OrderController.getOrdersByUser);
router.get("/admin/all", authMiddleware, OrderController.getAllOrders);
router.patch("/admin/:id/status", authMiddleware, OrderController.updateOrderStatus);
router.get("/:id", OrderController.getOrderById);

export default router;
