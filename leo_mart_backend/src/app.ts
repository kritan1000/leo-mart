import dotenv from "dotenv";
dotenv.config();

import express, { Application, NextFunction, Request, Response } from "express";
import { ApiResponseHelper } from "./utils/api-response";
import { HttpException } from "./exceptions/http-exception";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/user_route";
import blogRoutes from "./routes/blog_route";
import userAdminRoutes from "./routes/user_admin_route";
import productRoutes from "./routes/product_route";
import quotationRoutes from "./routes/quotation_route";
import paymentRoutes from "./routes/payment_route";
import orderRoutes from "./routes/order_route";

const app: Application = express();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json()); // use json as request
app.use(express.urlencoded({ extended: true })); //use form-urlencoded as request
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Mount API routes (supporting both /api/v1/... and /api/... prefixes)
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/admin/users", userAdminRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/quotations", quotationRoutes);

// Payment & Order Routes
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/orders", orderRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({ message: "Route Not Found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Always log the real error for debugging
  console.error("[ERROR]", err);

  // Zod validation errors
  if (err?.name === "ZodError" || err?.issues) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Validation Error",
      errors: err.issues,
    });
  }

  if (err instanceof HttpException) {
    return ApiResponseHelper.error(res, err.message, err.status);
  }

  return ApiResponseHelper.error(res, err?.message || "Internal Server Error", 500);
});

export default app;
