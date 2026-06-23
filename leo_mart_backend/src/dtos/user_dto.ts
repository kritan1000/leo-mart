import { UserSchema } from "../types/user_type";
import { z } from "zod";

export const CreateUserDto = UserSchema.pick({
  fullname: true,
  email: true,
  username: true,
  password: true,
}).extend({
  confirmPassword: z.string().min(6),
});
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const LoginUserDto = UserSchema.pick({
  email: true,
  password: true,
});
export type LoginUserDto = z.infer<typeof LoginUserDto>;
