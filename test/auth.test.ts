import {
  describe,
  it,
  expect,
  afterEach,
  beforeEach,
  afterAll,
  beforeAll,
} from "bun:test";
import app from "../src/index.js";
import testUtil from "./util/test.util.js";
import init from "../src/app/database.js";
import mongoose from "mongoose";
import UserModel, { setIsTest, User } from "../src/models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../src/utils/jwt.js";
describe("POST /api/auth/register", () => {
  beforeAll(async () => {
    setIsTest(true);
    await testUtil.createUser();
    console.info("create end");
  });
  beforeEach(async () => {
    await init();
  });
  afterEach(async () => {
    // await testUtil.deleteUser();
    await mongoose.connection.close();
  });
  afterAll(async () => {
    await init();
    // console.info("delete start");
    await testUtil.deleteUser(); // infinity loop

    // console.info("delete end");
    await mongoose.connection.close();
  });

  it("should be success create user", async () => {
    const response = await app.request("/api/auth/register", {
      method: "post",
      body: JSON.stringify({
        fullName: "test1234",
        username: "test1234",
        email: "test1234@test.com",
        password: "Test123",
        confirmPassword: "Test123",
      }),
    });
    const body = await response.json();

    console.info(body);
    expect(response.status).toBe(201);
    expect(body.data.username).toBe("test1234");
  });

  it("should be fail if username exist", async () => {
    const response = await app.request("/api/auth/register", {
      method: "post",
      body: JSON.stringify({
        fullName: "test",
        username: "test",
        email: "test2@test.com",
        password: "Test123",
        confirmPassword: "Test123",
      }),
    });
    const body = await response.json();

    console.info(body);
    expect(response.status).toBe(400);
    expect(body.data).toBeUndefined();
  });

  it("Should be fail if email exist", async () => {
    const response = await app.request("/api/auth/register", {
      method: "post",
      body: JSON.stringify({
        fullName: "test",
        username: "test3",
        email: "test@test.com",
        password: "Test123",
        confirmPassword: "Test123",
      }),
    });
    const body = await response.json();

    console.info(body);
    expect(response.status).toBe(400);
    expect(body.data).toBeUndefined();
  });

  it("Should be fail if confirm password doesnt match", async () => {
    const response = await app.request("/api/auth/register", {
      method: "post",
      body: JSON.stringify({
        fullName: "test",
        username: "test3",
        email: "test3@test.com",
        password: "Test123456",
        confirmPassword: "Test12345",
      }),
    });
    const body = await response.json();

    console.info(body);
    expect(response.status).toBe(400);
    expect(body.data).toBeUndefined();
  });
  it("Should be fail if format password invalid ", async () => {
    const response = await app.request("/api/auth/register", {
      method: "post",
      body: JSON.stringify({
        fullName: "test",
        username: "test3",
        email: "test3@test.com",
        password: "test",
        confirmPassword: "test",
      }),
    });
    const body = await response.json();

    console.info(body);
    expect(response.status).toBe(400);
    expect(body.data).toBeUndefined();
  });
});
it("Should be fail if format email invalid ", async () => {
  const response = await app.request("/api/auth/register", {
    method: "post",
    body: JSON.stringify({
      fullName: "test",
      username: "test3",
      email: "test3",
      password: "Test123",
      confirmPassword: "Test123",
    }),
  });
  const body = await response.json();

  console.info(body);
  expect(response.status).toBe(400);
  expect(body.data).toBeUndefined();
});
// });

describe("POST /api/auth/activation", () => {
  let user: User;
  beforeAll(async () => {
    setIsTest(true);
  });
  beforeEach(async () => {
    await init();
    await testUtil.deleteUser();
    user = await testUtil.createUser();
  });
  afterEach(async () => {
    // await testUtil.deleteUser();
    await mongoose.connection.close();
  });
  afterAll(async () => {
    await init();

    await testUtil.deleteUser();

    await mongoose.connection.close();
  });

  it("Should be success activation data", async () => {
    const response = await app.request(
      `/api/auth/activation?code=${user.activationCode}`,
      {
        method: "post",
      }
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.username).toBe("test");
    expect(body.data.isActive).toBe(true);
  });
  it("Should be fail if wrong code", async () => {
    const response = await app.request(`/api/auth/activation?code=123456789`, {
      method: "post",
    });

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.username).toBeUndefined();
  });
  it("Should be fail if invalid validation", async () => {
    const response = await app.request(`/api/auth/activation?code=`, {
      method: "post",
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.username).toBeUndefined();
  });
});

describe("POST /api/auth/login", () => {
  let user: User;
  beforeAll(async () => {
    setIsTest(true);
  });
  beforeEach(async () => {
    await init();
    await testUtil.deleteUser();
    user = await testUtil.createUser();
  });
  afterEach(async () => {
    // await testUtil.deleteUser();
    await mongoose.connection.close();
  });
  afterAll(async () => {
    await init();

    await testUtil.deleteUser();

    await mongoose.connection.close();
  });

  it("Should be success login with email", async () => {
    await UserModel.updateOne(
      {
        username: user.username,
      },
      {
        isActive: true,
      }
    );
    console.info(user);

    const response = await app.request("/api/auth/login", {
      method: "post",

      body: JSON.stringify({
        identifier: user.email,
        password: "Test123",
      }),
    });
    const body = await response.json();
    console.info(body);
    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
  });
  it("Should be success login with username", async () => {
    await UserModel.updateOne(
      {
        username: user.username,
      },
      {
        isActive: true,
      }
    );
    console.info(user);

    const response = await app.request("/api/auth/login", {
      method: "post",

      body: JSON.stringify({
        identifier: user.username,
        password: "Test123",
      }),
    });
    const body = await response.json();
    console.info(body);
    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
  });

  it("Should be fail if user not active", async () => {
    const response = await app.request("/api/auth/login", {
      method: "post",

      body: JSON.stringify({
        identifier: user.email,
        password: "Test123",
      }),
    });
    const body = await response.json();
    console.info(body);
    expect(response.status).toBe(403);
    expect(body.data).toBeUndefined();
  });
  it("Should be fail if wrong identifier ", async () => {
    const response = await app.request("/api/auth/login", {
      method: "post",

      body: JSON.stringify({
        identifier: "Invalid",
        password: "Test123",
      }),
    });
    const body = await response.json();
    console.info(body);
    expect(response.status).toBe(401);
    expect(body.data).toBeUndefined();
  });
  it("Should be fail if wrong password ", async () => {
    const response = await app.request("/api/auth/login", {
      method: "post",

      body: JSON.stringify({
        identifier: user.email,
        password: "Invalid",
      }),
    });
    const body = await response.json();
    console.info(body);
    expect(response.status).toBe(401);
    expect(body.data).toBeUndefined();
  });
});

describe("GET /api/auth/me", () => {
  let token: string;
  let user: User;
  beforeAll(async () => {
    setIsTest(true);
  });
  beforeEach(async () => {
    await init();
    await testUtil.deleteUser();
    user = await testUtil.createUser();
    token = await generateToken(user);
  });
  afterEach(async () => {
    // await testUtil.deleteUser();
    await mongoose.connection.close();
  });
  afterAll(async () => {
    await init();

    await testUtil.deleteUser();

    await mongoose.connection.close();
  });

  it("Should be success get user", async () => {
    const response = await app.request("/api/auth/me", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = await response.json();
    // console.info("test");
    console.info(body);
    expect(response.status).toBe(200);
    expect(body.data.username).toBe("test");
  });

  it("Should be fail if token invalid", async () => {
    const response = await app.request("/api/auth/me", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}1`,
      },
    });
    const body = await response.json();
    console.info(body);
    expect(response.status).toBe(401);
    expect(body.data).toBeUndefined();
  });
  it("Should be fail if Bearer missing", async () => {
    const response = await app.request("/api/auth/me", {
      method: "get",
      headers: {
        Authorization: `${token}`,
      },
    });
    const body = await response.json();
    console.info(body);
    expect(response.status).toBe(401);
    expect(body.data).toBeUndefined();
  });
});
