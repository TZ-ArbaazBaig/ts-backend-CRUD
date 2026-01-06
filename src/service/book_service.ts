import fs from "fs";
import { BookModel } from "../models/book_model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { GetBooksParams } from "../types/responce.js";
import { validateImages } from "../validations/image.validation.js";

export const getBooksService = async (query: GetBooksParams) => {
  const {
    search,
    author,
    publishYear,
    yearFrom,
    yearTo,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;

  // -------------------------
  // BUILD FILTER
  // -------------------------
  const filter: any = {};

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { author: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  //  FILTER → EXACT MATCH ONLY
  if (author) {
    filter.author = {
      $regex: `^${author}$`,
      $options: "i", // exact but case-insensitive
    };
  }

  if (publishYear) {
    filter.publishYear = publishYear; // exact year
  }

  if (yearFrom || yearTo) {
    filter.publishYear = {};
    if (yearFrom) filter.publishYear.$gte = yearFrom;
    if (yearTo) filter.publishYear.$lte = yearTo;
  }

  // -------------------------
  // QUERY DB
  // -------------------------
  const [items, total] = await Promise.all([
    BookModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    BookModel.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    },
  };
};


export const createBookService = async (data: any, files: any, res: any) => {
  const exists = await BookModel.findOne({
    name: data.name,
    author: data.author,
  });

  if (exists) throw new Error("DUPLICATE_BOOK");

  const imageFiles = validateImages(files, res);

  const uploadedImages: { url: string; publicId: string }[] = [];

  for (const file of imageFiles) {
    const uploadRes = await uploadToCloudinary(file.filepath);

    uploadedImages.push({
      url: uploadRes.secure_url,
      publicId: uploadRes.public_id,
    });

    fs.unlinkSync(file.filepath);
  }

  return BookModel.create({
    ...data,
    images: uploadedImages,
  });
};

// ==========================
// UPDATE BOOK
// ==========================
export const updateBookService = async (
  bookId: string,
  data: any,
  files: any,
  res: any
) => {
  const book = await BookModel.findById(bookId);
  if (!book) throw new Error("BOOK_NOT_FOUND");

  const imageFiles = validateImages(files, res);

  if (imageFiles.length > 0) {
    for (const img of book.images) {
      await deleteFromCloudinary(img.publicId);
    }

    book.images = [];

    for (const file of imageFiles) {
      const uploadRes = await uploadToCloudinary(file.filepath);
      book.images.push({
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
      });
      fs.unlinkSync(file.filepath);
    }
  }

  Object.assign(book, data);
  return book.save();
};


export const deleteBookService = async (bookId: string) => {
  const book = await BookModel.findById(bookId);
  if (!book) throw new Error("BOOK_NOT_FOUND");

  for (const img of book.images) {
    await deleteFromCloudinary(img.publicId);
  }

  await book.deleteOne();
  return book;
};

export const bulkCreateBooksService = async (books: any[]) => {
  if (!Array.isArray(books) || books.length === 0) {
    throw new Error("INVALID_PAYLOAD");
  }

  // Optional: prevent duplicates in bulk
  const preparedBooks = books.map((book) => ({
    ...book,
    createdAt: new Date(),
  }));

  return BookModel.insertMany(preparedBooks, {
    ordered: false, // continue even if some fail
  });
};

