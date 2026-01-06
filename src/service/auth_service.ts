import bcrypt from "bcryptjs";
import { UserModel, IUserDocument } from "../models/user_model.js";
import { generateToken } from "../utils/jwt.js";
import { redisClient } from "../utils/reddis.js";

export const registerService = async (payload: {
  username: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const { username, email, phone, password } = payload;

  const exists = await UserModel.findOne({
    $or: [{ email }, { phone }],
  });

  if (exists) {
    throw new Error("USER_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await UserModel.create({
    username,
    email,
    phone,
    password: hashedPassword,
  });

  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
  });

  return {
    token,
    user,
  };
};

export const loginService = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const user = (await UserModel.findOne({ email }).select(
    "+password"
  )) as IUserDocument | null;

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
  });

  return {
    token,
    user,
  };
};

export const logoutService = async (jti: string, exp: number) => {
  const ttl = exp - Math.floor(Date.now() / 1000);

  await redisClient.set(`bl:${jti}`, "true", {
    EX: ttl,
  });
};
