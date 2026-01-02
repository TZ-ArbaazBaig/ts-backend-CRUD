import mongoose, { Schema, model, Document } from "mongoose";

/**
 * IUser
 * This describes the SHAPE of a User object in TypeScript
 */
export interface IUser {
  username: string;
  email: string;
  phone: string;
  password: string;
  booksAdded?: mongoose.Types.ObjectId[];
  role: "user" | "admin";
}

/**
 * IUserDocument
 * Combines IUser + MongoDB document properties (_id, createdAt, etc.)
 */
export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please use a valid phone number"],
    },
    booksAdded: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        default: [],
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>("User", userSchema);
