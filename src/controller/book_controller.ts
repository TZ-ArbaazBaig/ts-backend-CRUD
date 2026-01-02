import { type Request, type Response, type NextFunction } from "express";
import { BookModel } from '../models/book_model.js'
import type { IResponse } from '../types/responce.ts'
import type { AuthRequest } from "../middleware/auth_middleware.js";

// --------------------
// GET BOOKS
// --------------------
export const getBooks = async (
    req: Request,
    res: Response<IResponse>,
    next: NextFunction
) => {
    try {
        const books = await BookModel.find().sort({ createdAt: -1 });

        const response: IResponse = {
            success: true,
            message: "Books fetched successfully",
            data: {
                count: books.length,
                items: books,
            },
        };

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

// --------------------
// ADD BOOK
// --------------------
export const addBook = async (
  req: AuthRequest,
  res: Response<IResponse>,
  next: NextFunction
) => {
  try {
    const { name, author, publishYear, description } = req.body;

    // --------------------
    // BASIC VALIDATION
    // --------------------
    if (!name || !author || !publishYear || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (
      typeof name !== "string" ||
      typeof author !== "string" ||
      typeof publishYear !== "number" ||
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data types provided",
      });
    }

    const currentYear = new Date().getFullYear();
    if (publishYear < 1500 || publishYear > currentYear) {
      return res.status(400).json({
        success: false,
        message: `publishYear must be between 1500 and ${currentYear}`,
      });
    }

    // --------------------
    // DUPLICATE CHECK
    // --------------------
    const existingBook = await BookModel.findOne({
      name: name.trim(),
      author: author.trim(),
    });

    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: "Book already exists",
      });
    }

    // --------------------
    // SAVE TO DB
    // --------------------
    const book = await BookModel.create({
      name: name.trim(),
      author: author.trim(),
      publishYear,
      description: description.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------
// UPDATE BOOK
// --------------------
export const updateBook = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, author, publishYear, description } = req.body;
    console.log("Updating book with ID:", id);
    // console.log(id);
   console.log(req.body);
    // --------------------
    // ID VALIDATION
    // --------------------
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Book id is required",
      });
    }

    // --------------------
    // CHECK IF BOOK EXISTS
    // --------------------
    const existingBook = await BookModel.findById(id);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // --------------------
    // FIELD VALIDATION 
    // --------------------
    if (name && typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name must be a string",
      });
    }

    if (author && typeof author !== "string") {
      return res.status(400).json({
        success: false,
        message: "Author must be a string",
      });
    }

    if (publishYear) {
      if (typeof publishYear !== "number") {
        return res.status(400).json({
          success: false,
          message: "publishYear must be a number",
        });
      }

      const currentYear = new Date().getFullYear();
      if (publishYear < 1500 || publishYear > currentYear) {
        return res.status(400).json({
          success: false,
          message: `publishYear must be between 1500 and ${currentYear}`,
        });
      }
    }

    if (description && typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }

    // --------------------
    // DUPLICATE CHECK (if name/author changing)
    // --------------------
    if (name || author) {
      const duplicateBook = await BookModel.findOne({
        _id: { $ne: id },
        name: name?.trim() || existingBook.name,
        author: author?.trim() || existingBook.author,
      });

      if (duplicateBook) {
        return res.status(409).json({
          success: false,
          message: "Another book with same name and author already exists",
        });
      }
    }

    // --------------------
    // UPDATE BOOK
    // --------------------
    const updatedBook = await BookModel.findByIdAndUpdate(
      id,
      {
        ...(name && { name: name.trim() }),
        ...(author && { author: author.trim() }),
        ...(publishYear && { publishYear }),
        ...(description && { description: description.trim() }),
      },
      { new: true, runValidators: true }
    );

    const response: IResponse = {
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// --------------------
// DELETE BOOK
// --------------------
export const deleteBook = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // --------------------
    // ID VALIDATION
    // --------------------
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Book id is required",
      });
    }

    // --------------------
    // CHECK IF BOOK EXISTS
    // --------------------
    const existingBook = await BookModel.findById(id);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // --------------------
    // DELETE BOOK
    // --------------------
    await BookModel.findByIdAndDelete(id);

    const response: IResponse = {
      success: true,
      message: "Book deleted successfully",
      data: {
        id,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
