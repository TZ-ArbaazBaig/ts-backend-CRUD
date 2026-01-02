import {type Request,type Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel, type IUserDocument } from "../models/user_model.js";
import { generateToken } from "../utils/jwt.js";
import type { AuthRequest } from "../middleware/auth_middleware.js";
import { redisClient } from "../utils/reddis.js";

// =======================
// REGISTER
// =======================
export const registerController = async (req: Request, res: Response) => {
  try {
    const { username, email, phone, password } = req.body as {
      username: string;
      email: string;
      phone: string;
      password: string;
    };
    console.log("Registering user with data:");
    console.log(req.body);

    if (!username || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user: IUserDocument = await UserModel.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    const token = generateToken({ id: user._id.toString(), role: user.role });

    

    res.status(201).json({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// =======================
// LOGIN
// =======================
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await UserModel.findOne({ email }).select(
      "+password"
    ) as IUserDocument | null;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token =generateToken({ id: user._id.toString(), role: user.role });


    res.status(200).json({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


export const logoutController = async (req: AuthRequest, res: Response) => {
  try {
    const jti = req.user?.jti;
    const exp = req.user?.exp;

    if (!jti || !exp) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    const ttl = exp - Math.floor(Date.now() / 1000);

    await redisClient.set(`bl:${jti}`, "true", {
      EX: ttl,
    });

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