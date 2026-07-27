import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import multer from "multer";
import path from "path";
import fs from "fs";

const userController = new UserController();
const router = Router();

// Setup multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Public routes
router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.post("/request-password-reset", userController.requestPasswordReset.bind(userController));
router.post("/reset-password/:token", userController.resetPassword.bind(userController));

// Protected routes
router.get("/whoami", authMiddleware, userController.whoami.bind(userController));
router.put("/update", authMiddleware, upload.single("profilePhoto"), userController.updateUser.bind(userController));
router.post("/business-account", authMiddleware, userController.applyBusinessAccount.bind(userController));

export default router;
