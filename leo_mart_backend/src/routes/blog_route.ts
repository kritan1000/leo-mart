import { BlogController } from "../controllers/blog.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const blogController = new BlogController();
const router = Router();

// Public routes
router.get("/", blogController.getBlogs.bind(blogController));
router.get("/:id", blogController.getBlogById.bind(blogController));

// Protected routes
router.post("/", authMiddleware, blogController.create.bind(blogController));
router.put("/:id", authMiddleware, blogController.update.bind(blogController));
router.delete("/:id", authMiddleware, blogController.delete.bind(blogController));

export default router;
