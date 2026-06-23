import { z } from "zod";

export const UserSchema = z.object({
  fullname: z.string(),
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(["admin", "user"]).default("user"),
});

export type UserType = z.infer<typeof UserSchema>;
