import { z } from "zod";

export const CreateProductDto = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Price must be at least 1 NPR")
  ),
  category: z.string().min(2, "Category is required"),
  brand: z.string().min(2, "Brand is required"),
  stockStatus: z.enum(["in-stock", "bulk-deal", "low-stock"]).default("in-stock"),
  minBulkQty: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().optional().default(0)
  ),
  bulkPrice: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().optional().default(0)
  ),
});

export type CreateProductDto = z.infer<typeof CreateProductDto>;

export const UpdateProductDto = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  price: z.preprocess(
    (val) => (val === undefined || val === null ? undefined : Number(val)),
    z.number().min(1).optional()
  ),
  category: z.string().min(2).optional(),
  brand: z.string().min(2).optional(),
  stockStatus: z.enum(["in-stock", "bulk-deal", "low-stock"]).optional(),
  minBulkQty: z.preprocess(
    (val) => (val === undefined || val === null ? undefined : Number(val)),
    z.number().optional()
  ),
  bulkPrice: z.preprocess(
    (val) => (val === undefined || val === null ? undefined : Number(val)),
    z.number().optional()
  ),
});

export type UpdateProductDto = z.infer<typeof UpdateProductDto>;
