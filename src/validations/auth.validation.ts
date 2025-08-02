import { password } from "bun";
import z from "zod";

const registerSchema = z
  .object({
    fullName: z.string().min(1),
    username: z.string().min(1),
    email: z.email().min(1),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});
export default { registerSchema, loginSchema };
