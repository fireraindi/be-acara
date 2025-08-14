import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { getUserData } from "../utils/jwt.js";

export default async (c: Context, next: Next) => {
  try {
    const authorization = c.req.header("Authorization");
    // console.info(authorization);

    // if (!authorization) {
    //   throw new HTTPException(401, { message: "Unauthorized" });
    // }

    const [_prefix, token] = authorization!.split(" ");
    // if (!(prefix === "Bearer" && token)) {
    //   throw new HTTPException(401, { message: "Unauthorized" });
    // }
    // console.info(token);
    const user = await getUserData(token);
    // console.info(user);

    // if (!user) {
    //   throw new HTTPException(401, { message: "Unauthorized" });
    // }

    c.set("user", user);

    await next();
  } catch (error) {
    return c.json({ message: "Unauthorized" }, 401);
  }
};
