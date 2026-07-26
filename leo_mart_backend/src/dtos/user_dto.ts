import { z } from "zod";

// Registration: accept fullname OR firstName+lastName, username is optional (auto-derived from email)
export const CreateUserDto = z.object({
  fullname: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  username: z.string().min(3).optional(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6).optional(),
});
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const LoginUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginUserDto = z.infer<typeof LoginUserDto>;

export const AdminCreateUserDto = z
  .object({
    fullname: z.string().optional(),
    fullName: z.string().optional(), // accept camelCase from Postman too
    email: z.string().email("Invalid email format"),
    username: z.string().min(3).optional(),
    role: z.enum(["admin", "user"]).default("user"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .transform((data) => ({
    ...data,
    // normalize: use fullname if given, otherwise fall back to fullName
    fullname: (data.fullname || data.fullName || "").trim(),
  }))
  .refine((data) => data.fullname.length >= 3, {
    path: ["fullname"],
    message: "Fullname must be at least 3 characters long",
  });
export type AdminCreateUserDto = z.infer<typeof AdminCreateUserDto>;

export const AdminUpdateUserDto = z
  .object({
    fullname: z.string().min(3).optional(),
    fullName: z.string().min(3).optional(),
    email: z.string().email().optional(),
    username: z.string().min(3).optional(),
    role: z.enum(["admin", "user"]).optional(),
    password: z.string().min(6).optional(),
    businessAccount: z
      .object({
        status: z.enum(["none", "pending", "approved", "rejected"]),
        businessName: z.string().optional(),
        registrationNo: z.string().optional(),
        businessType: z.string().optional(),
      })
      .optional(),
  })
  .transform((data) => ({
    ...data,
    fullname: data.fullname || data.fullName || undefined,
  }));
export type AdminUpdateUserDto = z.infer<typeof AdminUpdateUserDto>;
