import { z } from "zod";

export const UserSchema = z.object({
  fullname: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  username: z.string().min(3).optional(),
  password: z.string().min(6),
  role: z.enum(["admin", "user"]).default("user"),
});

export type UserType = z.infer<typeof UserSchema>;
