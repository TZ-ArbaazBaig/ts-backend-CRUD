import { Router} from "express";
import { addBook, deleteBook, getBooks, updateBook } from "../controller/book_controller.js";
import { authMiddleware } from "../middleware/auth_middleware.js";
import { adminOnly } from "../middleware/admin_middleware.js";

const bookRouter:Router= Router();

bookRouter.get('/get-books',authMiddleware,getBooks);
bookRouter.post('/add-books',authMiddleware,adminOnly,addBook);
bookRouter.patch("/update-books/:id", authMiddleware,adminOnly, updateBook);
bookRouter.delete("/delete-books/:id",authMiddleware,adminOnly,deleteBook );

export default bookRouter;