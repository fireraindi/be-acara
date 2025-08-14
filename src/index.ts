import { Hono } from "hono";
import { authController } from "./controllers/auth.controller.js";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { init } from "./app/database.js";
import { swagger } from "./docs/doc.js";
import { cors } from "hono/cors";

init();

const app = new Hono();
app.use("/*", cors());

app.route("/doc", swagger);
app.route("/api", authController);
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// init();
app.onError(async (err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        message: err.message,
      },
      err.status
    );
  } else if (err instanceof ZodError) {
    return c.json(
      {
        // errors: err.issues.map((e) => ({
        //   field: e.path.join("."),
        //   message: e.message,
        // })),
        messages: {
          field: err.issues[0].path[0],
          message: err.issues[0].message,
        },
      },
      400
    );
  } else {
    return c.json(
      {
        message: err.message,
      },
      500
    );
  }
});
export default app;
