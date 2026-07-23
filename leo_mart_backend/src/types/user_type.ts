import { z } from "zod";

export const UserSchema = z.object({
  fullname: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  username: z.string().min(3).optional(),
  password: z.string().min(6),
  role: z.enum(["admin", "user"]).default("user"),
  loyaltyPoints: z.number().default(0),
  businessAccount: z
    .object({
      status: z.enum(["none", "pending", "approved", "rejected"]).default("none"),
      businessName: z.string().optional(),
      registrationNo: z.string().optional(),
      businessType: z.string().optional(),
      appliedAt: z.date().optional(),
    })
    .optional(),
});

export type UserType = z.infer<typeof UserSchema>;
