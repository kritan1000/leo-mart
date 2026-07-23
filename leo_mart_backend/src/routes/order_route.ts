import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();

router.post("/cod", OrderController.createCodOrder);
router.get("/:id", OrderController.getOrderById);

export default router;
