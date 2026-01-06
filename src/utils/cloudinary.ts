import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "books",
    resource_type: "image",
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};
