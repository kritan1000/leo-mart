import Blog, { IBlog } from "../models/blog_model";

export interface IBlogRepository {
  create(blog: Partial<IBlog>): Promise<IBlog>;
  findById(id: string): Promise<IBlog | null>;
  findAllPaginated(
    page: number,
    size: number,
    search?: string
  ): Promise<{ data: IBlog[]; total: number }>;
  update(id: string, blog: Partial<IBlog>): Promise<IBlog | null>;
  delete(id: string): Promise<boolean>;
}

export class BlogMongoRepository implements IBlogRepository {
  async create(blog: Partial<IBlog>): Promise<IBlog> {
    const createdBlog = await Blog.create(blog);
    return createdBlog;
  }

  async findById(id: string): Promise<IBlog | null> {
    return Blog.findById(id).populate("author", "fullname email username");
  }

  async findAllPaginated(
    page: number,
    size: number,
    search?: string
  ): Promise<{ data: IBlog[]; total: number }> {
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * size;
    const total = await Blog.countDocuments(query);
    const data = await Blog.find(query)
      .populate("author", "fullname email username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size);

    return { data, total };
  }

  async update(id: string, blog: Partial<IBlog>): Promise<IBlog | null> {
    return Blog.findByIdAndUpdate(id, blog, { new: true }).populate("author", "fullname email username");
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await Blog.findByIdAndDelete(id);
    return !!deleted;
  }
}
