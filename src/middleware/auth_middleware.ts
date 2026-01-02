import {type Request,type Response,type NextFunction } from "express";
import jwt, {type JwtPayload as JwtLibPayload } from "jsonwebtoken";
import type { Role } from "./admin_middleware.js";
import { redisClient } from "../utils/reddis.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

interface JwtPayload extends JwtLibPayload {
  id: string;
  role: Role;
  jti: string;
}


export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const isBlacklisted = await redisClient.get(`bl:${decoded.jti}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token has been logged out",
      });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

