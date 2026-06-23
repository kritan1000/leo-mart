import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
