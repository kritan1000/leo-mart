import { BlogMongoRepository } from "../repositories/blog_repository";
import { CreateBlogDto, UpdateBlogDto } from "../dtos/blog_dto";
import { IBlog } from "../models/blog_model";
import mongoose from "mongoose";

const blogRepository = new BlogMongoRepository();

export class BlogService {
  async createBlog(blogData: CreateBlogDto, authorId: string): Promise<IBlog> {
    const newBlog = {
      ...blogData,
      author: new mongoose.Types.ObjectId(authorId) as any,
    };
    return blogRepository.create(newBlog);
  }

  async getBlogById(id: string): Promise<IBlog | null> {
    return blogRepository.findById(id);
  }

  async getBlogs(
    page: number,
    size: number,
    search?: string
  ): Promise<{ data: IBlog[]; total: number; totalPages: number; page: number; size: number }> {
    const { data, total } = await blogRepository.findAllPaginated(page, size, search);
    const totalPages = Math.ceil(total / size);
    return {
      data,
      total,
      totalPages,
      page,
      size,
    };
  }

  async updateBlog(id: string, blogData: UpdateBlogDto): Promise<IBlog | null> {
    return blogRepository.update(id, blogData as any);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return blogRepository.delete(id);
  }
}
