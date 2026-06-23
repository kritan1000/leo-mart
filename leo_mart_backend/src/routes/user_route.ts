import { UserController } from "../controllers/user.controller";
import { Router } from "express";

const userController = new UserController();
const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);

export default router;
