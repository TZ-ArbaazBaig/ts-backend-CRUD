import { Router } from "express";
import bookRouter from "./book_routes.js";
import authRouter from "./auth_routes.js";

const routes: Router = Router();


routes.use('/books',bookRouter)
routes.use('/auth',authRouter)

export default routes;