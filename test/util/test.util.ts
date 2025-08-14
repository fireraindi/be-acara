// import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserModel from "../../src/models/user.model.js";
import init from "../../src/app/database.js";
// import init from "../../src/app/database.js";

async function deleteUser() {
  await UserModel.deleteMany({
    username: { $regex: "test", $options: "i" },
  });
}

async function createUser() {
  const user = await UserModel.create({
    email: "test@test.com",
    fullName: "test",
    username: "test",
    password: await bcrypt.hash("Test123", 10),
  });
  return user;
}

export default { deleteUser, createUser };
