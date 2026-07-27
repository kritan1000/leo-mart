import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user_service';
import { CreateUserDto, LoginUserDto, AdminCreateUserDto, AdminUpdateUserDto } from '../dtos/user_dto';
import { ZodError } from 'zod';
import { HttpException } from '../exceptions/http-exception';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateUserDto.parse(req.body);
      const result = await userService.createUser(validated);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      console.error('[REGISTER ERROR]', error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.issues,
        });
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = LoginUserDto.parse(req.body);
      const result = await userService.loginUser(validated);

      // Set token in cookie
      res.cookie('token', result.token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: result,
      });
    } catch (error) {
      console.error('[LOGIN ERROR]', error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.issues,
        });
      }
      next(error);
    }
  }

  async whoami(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('[WHOAMI ERROR]', error);
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const updateData: any = {};
      if (req.body.fullname) updateData.fullname = req.body.fullname;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.password) updateData.password = req.body.password;
      if (req.file) {
        updateData.profilePicture = `/uploads/${req.file.filename}`;
      }

      const updated = await userService.updateUser(userId, updateData);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updated,
      });
    } catch (error) {
      console.error('[UPDATE ERROR]', error);
      next(error);
    }
  }

  // --- Admin User Management Methods ---

  async adminGetUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const search = (req.query.search as string) || undefined;

      const result = await userService.getUsers(page, size, search);
      return res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: result,
      });
    } catch (error) {
      console.error('[ADMIN GET USERS ERROR]', error);
      next(error);
    }
  }

  async adminGetUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('[ADMIN GET USER BY ID ERROR]', error);
      next(error);
    }
  }

  async adminCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = AdminCreateUserDto.parse(req.body);
      const result = await userService.createUser(validated as any);
      return res.status(201).json({
        success: true,
        message: 'User created successfully by admin',
        data: result,
      });
    } catch (error) {
      console.error('[ADMIN CREATE USER ERROR]', error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.issues,
        });
      }
      next(error);
    }
  }

  async adminUpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = AdminUpdateUserDto.parse(req.body);
      
      const updated = await userService.updateUser(id, validated as any);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'User updated successfully by admin',
        data: updated,
      });
    } catch (error) {
      console.error('[ADMIN UPDATE USER ERROR]', error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.issues,
        });
      }
      next(error);
    }
  }

  async adminDeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (id === req.user?.id) {
        return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
      }

      const deleted = await userService.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully by admin',
      });
    } catch (error) {
      console.error('[ADMIN DELETE USER ERROR]', error);
      next(error);
    }
  }

  async adminGetBusinessAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const status = (req.query.status as string) || undefined;

      const result = await userService.getBusinessAccounts(page, size, status);
      return res.status(200).json({
        success: true,
        message: 'Business accounts fetched successfully',
        data: result,
      });
    } catch (error) {
      console.error('[ADMIN GET BUSINESS ACCOUNTS ERROR]', error);
      next(error);
    }
  }

  async applyBusinessAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { businessName, registrationNo, businessType } = req.body;
      if (!businessName || !registrationNo) {
        return res.status(400).json({
          success: false,
          message: "Business Name and Registration/VAT Number are required.",
        });
      }

      const updatedUser = await userService.updateUser(userId, {
        businessAccount: {
          status: "pending",
          businessName,
          registrationNo,
          businessType: businessType || "Retailer",
          appliedAt: new Date(),
        },
      } as any);

      return res.status(200).json({
        success: true,
        message: "Business Account application submitted successfully!",
        data: updatedUser,
      });
    } catch (error) {
      console.error("[APPLY BUSINESS ACCOUNT ERROR]", error);
      next(error);
    }
  }

  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      await userService.requestPasswordReset(email.trim());
      return res.status(200).json({
        success: true,
        message: "Password reset link sent successfully",
      });
    } catch (error: any) {
      if (error instanceof HttpException && error.status === 404) {
        return res.status(404).json({
          success: false,
          message: "Email not found",
        });
      }
      console.error("[REQUEST PASSWORD RESET ERROR]", error);
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || typeof newPassword !== "string") {
        return res.status(400).json({
          success: false,
          message: "New password is required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      await userService.resetPassword(token, newPassword);
      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error: any) {
      if (error instanceof HttpException && error.status === 400) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      console.error("[RESET PASSWORD ERROR]", error);
      next(error);
    }
  }
}