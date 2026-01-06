import Joi from "joi";

// ======================
// CREATE BOOK
// ======================
export const createBookSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  author: Joi.string().trim().min(2).max(100).required(),
  publishYear: Joi.number()
    .integer()
    .min(1500)
    .max(new Date().getFullYear())
    .required(),
  description: Joi.string().trim().min(5).max(500).required(),
});

// ======================
// UPDATE BOOK
// ======================
export const updateBookSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  author: Joi.string().trim().min(2).max(100).optional(),
  publishYear: Joi.number()
    .integer()
    .min(1500)
    .max(new Date().getFullYear())
    .optional(),
  description: Joi.string().trim().min(5).max(500).optional(),
});

// ======================
// GET BOOKS (SEARCH + FILTER + PAGINATION)
// ======================
export const getBooksQuerySchema = Joi.object({
  search: Joi.string().allow("").optional(),

  author: Joi.string().trim().min(2).max(100).optional(),

  publishYear: Joi.number()
    .integer()
    .min(1500)
    .max(new Date().getFullYear())
    .optional(),

  yearFrom: Joi.number()
    .integer()
    .min(1500)
    .max(new Date().getFullYear())
    .optional(),

  yearTo: Joi.number()
    .integer()
    .min(1500)
    .max(new Date().getFullYear())
    .optional(),

  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),
});
