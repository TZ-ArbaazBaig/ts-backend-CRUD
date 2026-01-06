import { Request, Response, NextFunction } from "express";
import formidable from "formidable";
import {
  createBookService,
  updateBookService,
  deleteBookService,
  getBooksService,
  bulkCreateBooksService,
} from "../service/book_service";
import {
  createBookSchema,
  getBooksQuerySchema,
  updateBookSchema,
} from "../validations/book_validation";
import { normalizeFields } from "../utils/formidable_helper";


// ==========================
// GET BOOKS (SEARCH + FILTER + PAGINATION)
// ==========================
export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // -------------------------
    // VALIDATE QUERY PARAMS
    // -------------------------
    const { error, value } = getBooksQuerySchema.validate(req.query, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join(", "),
      });
    }

    const { query} = req;

    const result = await getBooksService(query);

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


export const addBook = async (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return next(err);

    try {
      const data = normalizeFields(fields);

      const { error } = createBookSchema.validate(data);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      const book = await createBookService(data, files, res);

      res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: book,
      });
    } catch (e: any) {
      if (e.message === "DUPLICATE_BOOK") {
        return res.status(409).json({
          success: false,
          message: "Book already exists",
        });
      }
      next(e);
    }
  });
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return next(err);

    try {
      const data = normalizeFields(fields);

      const { error } = updateBookSchema.validate(data);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      const book = await updateBookService(req.params.id, data, files, res);

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book,
      });
    } catch (e: any) {
      if (e.message === "BOOK_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }
      next(e);
    }
  });
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await deleteBookService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: book,
    });
  } catch (e: any) {
    if (e.message === "BOOK_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    next(e);
  }
};

export const bulkCreateBooksController = async (req: Request, res: Response) => {
  try {
    const { books } = req.body;

    const result = await bulkCreateBooksService(books);

    res.status(201).json({
      success: true,
      count: result.length,
      message: "Books inserted successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message:  "Bulk insert failed",
    });
  }
};
