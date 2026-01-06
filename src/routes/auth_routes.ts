import {Router} from "express";
import { loginController, logoutController, registerController } from "../controller/auth_controller.js";
import { authMiddleware } from "../middleware/auth_middleware.js";

const authRouter:Router= Router();

authRouter.post('/register',registerController)
authRouter.post('/login',loginController)
authRouter.post("/logout", authMiddleware, logoutController);


export default authRouter;
