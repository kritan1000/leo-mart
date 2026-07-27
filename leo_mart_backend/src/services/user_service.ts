import { UserMongoRepository } from "../repositories/user_repository";
import { CreateUserDto, LoginUserDto } from "../dtos/user_dto";
import { HttpException } from "../exceptions/http-exception";
import bcrypt from "bcryptjs";
import { IUser } from "../models/user_model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/constant";
import crypto from "crypto";
import { sendEmail, passwordResetEmailTemplate } from "../utils/email";

const userRepository = new UserMongoRepository();

export class UserService {
  async createUser(userData: CreateUserDto) {
    // Auto-generate username from email if not provided
    const username = userData.username || userData.email.split("@")[0];

    // Check if username or email already exists
    const existingUserByUsername = await userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new HttpException(400, "Username already exists");
    }
    const existingUserByEmail = await userRepository.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new HttpException(400, "Email already exists");
    }
    // Validate password confirmation only if confirmPassword is provided
    if (userData.confirmPassword && userData.password !== userData.confirmPassword) {
      throw new HttpException(400, "Passwords do not match");
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Build fullname from firstName+lastName if fullname not provided
    const fullname =
      userData.fullname ||
      [userData.firstName, userData.lastName].filter(Boolean).join(" ") ||
      username;

    const userToCreate = {
      ...userData,
      username,
      fullname,
      password: hashedPassword,
    };
    const createdUser = await userRepository.create(userToCreate as any);
    return createdUser;
  }

  async loginUser(loginData: LoginUserDto) {
    const user = await userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new HttpException(400, "Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(400, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "30d" },
    );
    return { user, token };
  }

  async getUserById(id: string): Promise<IUser | null> {
    return userRepository.findById(id);
  }

  async updateUser(id: string, updateData: Partial<IUser> & { password?: string }): Promise<IUser | null> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return userRepository.update(id, updateData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return userRepository.delete(id);
  }

  async getUsers(
    page: number,
    size: number,
    search?: string
  ): Promise<{ data: IUser[]; total: number; totalPages: number; page: number; size: number }> {
    const { data, total } = await userRepository.findAllPaginated(page, size, search);
    const totalPages = Math.ceil(total / size);
    return {
      data,
      total,
      totalPages,
      page,
      size,
    };
  }

  async getBusinessAccounts(
    page: number,
    size: number,
    status?: string
  ): Promise<{ data: IUser[]; total: number; totalPages: number; page: number; size: number }> {
    const { data, total } = await userRepository.findBusinessAccounts(page, size, status);
    const totalPages = Math.ceil(total / size);
    return {
      data,
      total,
      totalPages,
      page,
      size,
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new HttpException(404, "Email not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await userRepository.update(user._id.toString(), {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    } as any);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "LeoMart - Password Reset Request",
      html: passwordResetEmailTemplate(resetUrl),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userRepository.findByResetToken(hashedToken);
    if (!user) {
      throw new HttpException(400, "Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.update(user._id.toString(), {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    } as any);
  }
}
