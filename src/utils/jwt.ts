// import jwt, { type SignOptions } from "jsonwebtoken";
// import { randomUUID } from "crypto";
// import dotenv from "dotenv";


// if (!process.env.JWT_SECRET) {
//   throw new Error("JWT_SECRET is not defined in environment variables");
// }

// export const JWT_SECRET = process.env.JWT_SECRET ;

// const JWT_EXPIRES_IN =Number( process.env.JWT_EXPIRES_IN) || 7 * 24 * 60 * 60;

// export const generateToken = (payload: {
//   id: string;
//   role: string;
// }): string => {
//   const options: SignOptions = {
//     expiresIn: JWT_EXPIRES_IN,
//   };

//   return jwt.sign(
//     {
//       ...payload,
//       jti: randomUUID(),
//     },
//     JWT_SECRET,
//     options
//   );
// };

import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import type ms from "ms";

dotenv.config();

// ==========================
// JWT SECRET (SAFE)
// ==========================
const _JWT_SECRET = process.env.JWT_SECRET;
if (!_JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const JWT_SECRET: string = _JWT_SECRET;

// ==========================
// JWT EXPIRY (TYPE SAFE)
// ==========================
const JWT_EXPIRES_IN: number | ms.StringValue = (
  process.env.JWT_EXPIRES_IN ?? "7d"
) as ms.StringValue;

// ==========================
// TOKEN GENERATOR
// ==========================
export const generateToken = (payload: {
  id: string;
  role: string;
}): string => {
  return jwt.sign(
    {
      ...payload,
      jti: randomUUID(),
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};
