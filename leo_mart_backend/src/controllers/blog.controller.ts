import { Request, Response, NextFunction } from "express";
import { BlogService } from "../services/blog_service";
import { CreateBlogDto, UpdateBlogDto } from "../dtos/blog_dto";
import { ZodError } from "zod";

const blogService = new BlogService();

export class BlogController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // authorId comes from JWT decoded by authMiddleware
      const authorId = req.user?.id;
      if (!authorId) {
        return res.status(401).json({ success: false, message: "Unauthorized: user not found in token" });
      }

      // Validate and parse request body
      const parseResult = CreateBlogDto.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: parseResult.error.issues,
        });
      }

      const blog = await blogService.createBlog(parseResult.data, authorId);
      return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const search = (req.query.search as string) || undefined;

      const result = await blogService.getBlogs(page, size, search);
      return res.status(200).json({
        success: true,
        message: "Blogs fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBlogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const blog = await blogService.getBlogById(id);
      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
      return res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validate and parse
      const parseResult = UpdateBlogDto.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: parseResult.error.issues,
        });
      }

      const blog = await blogService.updateBlog(id, parseResult.data);
      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await blogService.deleteBlog(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
