import fs from "fs";
import { Response } from "express";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const MAX_IMAGE_SIZE_MB = 5;

export const validateImages = (files: any, res: Response) => {
  const imageFiles = files.images
    ? Array.isArray(files.images)
      ? files.images
      : [files.images]
    : [];

  if (imageFiles.length === 0) return imageFiles;

  for (const file of imageFiles) {
    // ❌ Type validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype || "")) {
      fs.unlinkSync(file.filepath);
      throw new Error("INVALID_IMAGE_TYPE");
    }

    // ❌ Size validation
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_IMAGE_SIZE_MB) {
      fs.unlinkSync(file.filepath);
      throw new Error("IMAGE_TOO_LARGE");
    }
  }

  return imageFiles;
};
