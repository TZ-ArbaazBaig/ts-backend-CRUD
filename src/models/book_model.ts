import { Schema, model } from "mongoose";

export interface IBookImage {
  url: string;
  publicId: string;
}

export interface IBook {
  name: string;
  author: string;
  publishYear: number;
  description: string;
  images: IBookImage[];
}

const bookSchema = new Schema<IBook>(
  {
    name: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    publishYear: { type: Number, required: true },
    description: { type: String, required: true, maxlength: 500 },

    // 👇 multiple images
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, collection: "books" }
);

export const BookModel = model<IBook>("Book", bookSchema);
