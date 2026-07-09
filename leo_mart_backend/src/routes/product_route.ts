import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import multer from "multer";
import path from "path";
import fs from "fs";

const productController = new ProductController();
const router = Router();

// Setup multer for product image uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `product-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Public routes
router.get("/", productController.getProducts.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));

// Admin only routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  productController.create.bind(productController)
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  productController.update.bind(productController)
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.delete.bind(productController)
);

export default router;
