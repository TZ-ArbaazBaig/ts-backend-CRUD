import jwt, { type SignOptions } from "jsonwebtoken";
import { randomUUID } from "crypto";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

const JWT_EXPIRES_IN = 7 * 24 * 60 * 60;

export const generateToken = (payload: {
  id: string;
  role: string;
}): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(
    {
      ...payload,
      jti: randomUUID(),
    },
    JWT_SECRET,
    options
  );
};
