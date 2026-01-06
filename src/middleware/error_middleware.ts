import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Error:", err.message);

  switch (err.message) {
    case "DUPLICATE_BOOK":
      return res.status(409).json({
        success: false,
        message: "Book already exists",
      });

    case "BOOK_NOT_FOUND":
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });

    case "INVALID_IMAGE_TYPE":
      return res.status(400).json({
        success: false,
        message: "Only JPG, PNG, WEBP, SVG images are allowed",
      });

    case "IMAGE_TOO_LARGE":
      return res.status(400).json({
        success: false,
        message: "Image size must be less than 5MB",
      });

    default:
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
  }
};
