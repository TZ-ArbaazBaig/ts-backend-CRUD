
// import { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import { UserModel, IUserDocument } from "../models/user_model.js";
// import { generateToken } from "../utils/jwt.js";
// import { redisClient } from "../utils/reddis.js";
// import { AuthRequest } from "../middleware/auth_middleware.js";

// // =======================
// // REGISTER
// // =======================
// export const registerController = async (req: Request, res: Response) => {
//   try {
//     const { username, email, phone, password } = req.body;

//     if (!username || !email || !phone || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const exists = await UserModel.findOne({
//       $or: [{ email }, { phone }],
//     });

//     if (exists) {
//       return res.status(409).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await UserModel.create({
//       username,
//       email,
//       phone,
//       password: hashedPassword,
//     });

//     const token = generateToken({
//       id: user._id.toString(),
//       role: user.role,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       token,
//       data: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch {
//     return res.status(500).json({
//       success: false,
//       message: "Registration failed",
//     });
//   }
// };

// // =======================
// // LOGIN
// // =======================
// export const loginController = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user = (await UserModel.findOne({ email }).select(
//       "+password"
//     )) as IUserDocument | null;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const token = generateToken({
//       id: user._id.toString(),
//       role: user.role,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       data: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch {
//     return res.status(500).json({
//       success: false,
//       message: "Login failed",
//     });
//   }
// };

// // =======================
// // LOGOUT (REDIS BLACKLIST)
// // =======================
// export const logoutController = async (req: AuthRequest, res: Response) => {
//   try {
//     const { jti, exp } = req.user!;

//     const ttl = exp! - Math.floor(Date.now() / 1000);

//     await redisClient.set(`bl:${jti}`, "true", {
//       EX: ttl,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Logout successful",
//     });
//   } catch {
//     return res.status(500).json({
//       success: false,
//       message: "Logout failed",
//     });
//   }
// };
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth_middleware.js";
import {
  registerService,
  loginService,
  logoutService,
} from "../service/auth_service";
import {
  registerSchema,
  loginSchema,
} from "../validations/auth_validation";

/**
 * REGISTER
 */
export const registerController = async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { token, user } = await registerService(value);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    if (err.message === "USER_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

/**
 * LOGIN
 */
export const loginController = async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { token, user } = await loginService(value);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/**
 * LOGOUT
 */
export const logoutController = async (req: AuthRequest, res: Response) => {
  try {
    const { jti, exp } = req.user!;

    await logoutService(jti!, exp!);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
