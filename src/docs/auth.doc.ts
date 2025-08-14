import { createRoute, z } from "@hono/zod-openapi";
import authValidation from "../validations/auth.validation.js";
import { swagger } from "./doc.js";

const path = "api/auth";
const tags = ["Auth"];

export const registerRoute = createRoute({
  method: "post",
  tags: tags,
  path: `${path}/register`,
  request: {
    body: {
      content: {
        "application/json": {
          schema: authValidation.registerSchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Success create account",
    },
    400: {
      description: "Invalid validation / User exist",
    },
  },
});

export const loginRoute = createRoute({
  method: "post",
  tags: tags,
  path: `${path}/login`,
  request: {
    body: {
      content: {
        "application/json": {
          schema: authValidation.loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Success login ",
    },
    401: {
      description: "Unauthorized",
    },
    403: {
      description: "Forbidden",
    },
  },
});

export const activationRoute = createRoute({
  method: "post",
  path: `${path}/activation`,
  tags: tags,
  request: {
    query: authValidation.activationSchema,
  },
  responses: {
    200: {
      description: "User activated",
    },
    400: {
      description: "Invalid validation",
    },
    404: {
      description: "User not found",
    },
  },
});

export const meRoute = createRoute({
  method: "get",
  tags: tags,
  path: `${path}/me`,
  summary: "Protected bearer Route Example",
  security: [
    {
      AuthorizationBearer: [], // <- Add security name (must be same)
    },
  ],
  request: {},
  responses: {
    200: {
      description: "Success get user",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "User not found",
    },
  },
});

export default function authDoc() {
  swagger.openAPIRegistry.register(
    "RegisterSchema",
    authValidation.registerSchema
  );
  swagger.openAPIRegistry.register("LoginSchema", authValidation.loginSchema);
  swagger.openAPIRegistry.register(
    "ActivationSchema",
    authValidation.activationSchema
  );
  swagger.openapi(registerRoute, (c) => {
    return c.json({ test: "test" }, 200);
  });
  swagger.openapi(loginRoute, (c) => {
    return c.json({ test: "test" }, 200);
  });
  swagger.openapi(activationRoute, (c) => {
    return c.json({ test: "test" }, 200);
  });
  swagger.openapi(meRoute, (c) => {
    return c.json({ test: "test" }, 200);
  });
}
