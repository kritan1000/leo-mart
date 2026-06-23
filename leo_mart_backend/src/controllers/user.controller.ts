import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user_service'; 
import { CreateUserDto, LoginUserDto} from '../dtos/user_dto';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateUserDto.parse(req.body);
      const result = await (userService.createUser)(validated);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = LoginUserDto.parse(req.body);
      const result = await userService.loginUser(validated);
      
      // Set token in cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

}