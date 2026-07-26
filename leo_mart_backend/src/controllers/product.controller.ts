import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product_service";
import { CreateProductDto, UpdateProductDto } from "../dtos/product_dto";
import { ZodError } from "zod";

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Product image is required" });
      }

      // Parse body (multer text fields)
      const parseResult = CreateProductDto.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: parseResult.error.issues,
        });
      }

      const imagePath = `/uploads/${req.file.filename}`;
      const productData = {
        ...parseResult.data,
        image: imagePath,
      };

      const product = await productService.createProduct(productData);
      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const search = (req.query.search as string) || undefined;
      const category = (req.query.category as string) || undefined;
      const brand = (req.query.brand as string) || undefined;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

      const result = await productService.getProducts(
        page,
        size,
        search,
        category,
        brand,
        minPrice,
        maxPrice
      );

      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const parseResult = UpdateProductDto.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: parseResult.error.issues,
        });
      }

      const updateData: any = { ...parseResult.data };
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const updated = await productService.updateProduct(id, updateData);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await productService.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
