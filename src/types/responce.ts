import { JwtPayload } from "jsonwebtoken";
import { FormField } from "../utils/formidable_helper";

export interface IResponse <T>{
  success: boolean;
  message: string;
  data?:T;
}

export interface GetBooksParams {
  search?: string;
  author?: string;
  publishYear?: number;
  yearFrom?: number;
  yearTo?: number;
  page?: number;
  limit?: number;
}

export interface NormalizedBookFields {
  name?: string;
  author?: string;
  publishYear?: number;
  description?: string;
}


export interface BookFormFields {
  name?: FormField;
  author?: FormField;
  publishYear?: FormField;
  description?: FormField;
}

export interface AuthRequest extends Request {
  user?: JwtPayload & {
    id: string;
    role: string;
    jti: string;
  };
}