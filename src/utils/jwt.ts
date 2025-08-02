import { decode, sign, verify } from "hono/jwt";
import { JWT_SECRET } from "./env.js";
import { User } from "../models/user.model.js";
export const generateToken = async (user: Partial<User>): Promise<string> => {
  const token = await sign(
    {
      id: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    JWT_SECRET!
  );
  return token;
};

export const getUserData = async (token: string) => {
  const { id, email } = await verify(token, JWT_SECRET);
  return { id, email };
};
