import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const userController = new UserController();
const router = Router();

// Admin User CRUD routes
router.get("/business-accounts", authMiddleware, adminMiddleware, userController.adminGetBusinessAccounts.bind(userController));
router.get("/", authMiddleware, adminMiddleware, userController.adminGetUsers.bind(userController));
router.get("/:id", authMiddleware, adminMiddleware, userController.adminGetUserById.bind(userController));
router.post("/", authMiddleware, adminMiddleware, userController.adminCreateUser.bind(userController));
router.put("/:id", authMiddleware, adminMiddleware, userController.adminUpdateUser.bind(userController));
router.delete("/:id", authMiddleware, adminMiddleware, userController.adminDeleteUser.bind(userController));

export default router;
