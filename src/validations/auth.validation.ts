import { extendZodWithOpenApi } from "@hono/zod-openapi";
import z from "zod";
import { swagger } from "../docs/doc.js";

extendZodWithOpenApi(z);

const registerSchema = z
  .object({
    fullName: z.string().min(1),
    username: z.string().min(1),
    email: z.email().min(1),
    password: z
      .string()
      .min(6, "Password must be at least 6 character")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .describe("At least 1 uppercase and 1 number"),
    confirmPassword: z.string().min(1),
  })
  .openapi({
    example: {
      fullName: "user",
      username: "user",
      email: "uset@test.com",
      password: "User123",
      confirmPassword: "User123",
    },
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password not match",
    path: ["confirmPassword"],
  });

const loginSchema = z
  .object({
    identifier: z.string().min(1),
    password: z.string().min(1),
  })
  .openapi({
    example: {
      identifier: "user@test.com",
      password: "User123",
    },
  });

const activationSchema = z.object({
  code: z.string().min(1),
});

export default { registerSchema, loginSchema, activationSchema };
