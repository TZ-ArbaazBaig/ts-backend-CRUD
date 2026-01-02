import { Schema, model } from "mongoose";

export interface IBook {
  name: string;
  author: string;
  publishYear: number;
  description: string;
}

const bookSchema = new Schema<IBook>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    publishYear: {
      type: Number,
      required: true,
      min: 1500,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

export const BookModel = model<IBook>("Book", bookSchema);
