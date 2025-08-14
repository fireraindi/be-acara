import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import authDoc from "./auth.doc.js";
import authValidation from "../validations/auth.validation.js";

export const swagger = new OpenAPIHono();

swagger.doc("/", {
  openapi: "3.0.0",
  info: {
    version: "0.0.1",
    title: "Event Documentation",
  },
  servers: [
    {
      url: "http://localhost:3000/",
      description: "Localhost Server",
    },
    {
      url: "https://be-acara-six.vercel.app/",
      description: "Deploy Server",
    },
  ],
  security: [
    {
      AuthorizationBearer: [],
    },
  ],
  tags: [{ name: "Auth", description: "Authentification Api" }],
});

swagger.openAPIRegistry.registerComponent(
  "securitySchemes",
  "AuthorizationBearer", // <- Add security name
  {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  }
);

// path
authDoc();

swagger.get("/ui", swaggerUI({ url: "/doc" }));
