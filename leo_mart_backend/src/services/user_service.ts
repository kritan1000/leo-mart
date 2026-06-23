import { UserMongoRepository } from "../repositories/user_repository";
import { CreateUserDto, LoginUserDto } from "../dtos/user_dto";
import { HttpException } from "../exceptions/http-exception";
import bcrypt from "bcryptjs"; // to hash password
import { IUser } from "../models/user_model";
// jwt for token generation
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/constant";

const userRepository = new UserMongoRepository();
export class UserService {
  async createUser(userData: CreateUserDto) {
    // Check if username or email already exists
    const existingUserByUsername = await userRepository.findByUsername(
      userData.username,
    );
    if (existingUserByUsername) {
      throw new HttpException(400, "Username already exists");
    }
    const existingUserByEmail = await userRepository.findByEmail(
      userData.email,
    );
    if (existingUserByEmail) {
      throw new HttpException(400, "Email already exists");
    }
    // Validate password confirmation
    if ((userData as any).password !== (userData as any).confirmPassword) {
      throw new HttpException(400, "Passwords do not match");
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userToCreate = {
      ...userData,
      password: hashedPassword,
    };
    const createdUser = await userRepository.create(userToCreate as any);
    return createdUser;
  }

  async loginUser(loginData: LoginUserDto) {
    const user = await userRepository.findByEmail(loginData.email);
    console.log(user);
    if (!user) {
      throw new HttpException(400, "Invalid email or password");
    }
    console.log(user);
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    ); // compare hashed password
    if (!isPasswordValid) {
      throw new HttpException(400, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      }, // payload
      SECRET_KEY,
      { expiresIn: "30d" },
    );
    return { user, token };
  }
}
