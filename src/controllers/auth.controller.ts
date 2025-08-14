import { Hono } from "hono";
import { LoginRequest, RegisterRequest, User } from "../models/user.model.js";
import authService from "../services/auth.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

type Variable = {
  user: User;
};

export const authController = new Hono<{
  Variables: Variable;
}>().basePath("/auth");

authController.post("/register", async (c) => {
  const request = (await c.req.json()) as RegisterRequest;

  const response = await authService.register(request);

  return c.json(
    {
      message: "Success registration!",
      data: {
        fullName: response.fullName,
        username: response.username,
        email: response.email,
      },
    },
    201
  );
});

authController.post("/login", async (c) => {
  const request = (await c.req.json()) as LoginRequest;
  // console.info(request);
  const response = await authService.login(request);

  return c.json({ data: response }, 200);
});

authController.get("/me", authMiddleware, async (c) => {
  const user = await c.get("user");
  // console.info(user);
  const response = await authService.me(user.id);

  return c.json({ message: "Success get user", data: response }, 200);
});

authController.post("/activation", async (c) => {
  console.info("Start");
  const request = await c.req.query("code");
  console.info(request);
  const response = await authService.activation(request!);
  console.info(response);

  return c.json(
    { message: "User successfully activated", data: response },
    200
  );
});
