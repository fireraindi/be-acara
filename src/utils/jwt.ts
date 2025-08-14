import { decode, sign, verify } from "hono/jwt";
import { JWT_SECRET } from "./env.js";
import { User } from "../models/user.model.js";
import { HTTPException } from "hono/http-exception";
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
  const decoded = await verify(token, JWT_SECRET);
  if (!decoded) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  const { id, email } = decoded;
  return { id, email };
};
