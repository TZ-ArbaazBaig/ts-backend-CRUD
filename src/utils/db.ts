import mongoose from "mongoose";

export const connectDB: () => Promise<void> = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected successfully");
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};