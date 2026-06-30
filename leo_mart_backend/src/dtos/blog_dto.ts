import { z } from "zod";

export const CreateBlogDto = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  image: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type CreateBlogDto = z.infer<typeof CreateBlogDto>;

export const UpdateBlogDto = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateBlogDto = z.infer<typeof UpdateBlogDto>;
