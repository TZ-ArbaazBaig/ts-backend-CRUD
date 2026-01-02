import type { AuthRequest } from "./auth_middleware.js";
import { type Response, type NextFunction } from "express";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only",
    }); 
  }

  next();
};
