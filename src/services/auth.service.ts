import { HTTPException } from "hono/http-exception";
import UserModel, {
  LoginRequest,
  RegisterRequest,
} from "../models/user.model.js";
import authValidation from "../validations/auth.validation.js";
import { generateToken } from "../utils/jwt.js";
import { Types } from "mongoose";
import * as bcrypt from "bcrypt";

const register = async (request: RegisterRequest) => {
  const requestValidate: RegisterRequest =
    authValidation.registerSchema.parse(request);

  const userExist = await UserModel.findOne({
    $or: [
      {
        username: requestValidate.username,
      },
      {
        email: requestValidate.email,
      },
    ],
  });
  if (userExist) {
    if (userExist.username === requestValidate.username) {
      throw new HTTPException(400, { message: "Username already used" });
    }
    if (userExist.email === requestValidate.email) {
      throw new HTTPException(400, { message: "Email already used" });
    }
  }

  const user = await UserModel.create({
    fullName: requestValidate.fullName,
    username: requestValidate.username,
    email: requestValidate.email,
    // password: await Bun.password.hash(requestValidate.password, {
    //   algorithm: "bcrypt",
    //   cost: 10,
    // }),
    password: await bcrypt.hash(requestValidate.password, 10),
  });

  return user;
};

const login = async (request: LoginRequest) => {
  const requestValidate: LoginRequest =
    authValidation.loginSchema.parse(request);

  const userExist = await UserModel.findOne({
    $or: [
      { username: requestValidate.identifier },
      { email: requestValidate.identifier },
    ],
  });

  if (!userExist) {
    throw new HTTPException(401, { message: "Invalid u credentials" });
  }

  // const validatePassword = await Bun.password.verify(
  //   requestValidate.password,
  //   userExist.password
  // );

  const validatePassword = await bcrypt.compare(
    requestValidate.password,
    userExist.password
  );

  if (!validatePassword) {
    throw new HTTPException(401, { message: "Invalid p credentials" });
  }

  const token = await generateToken(userExist);

  return token;
};

const me = async (id: Types.ObjectId) => {
  // console.info(id);
  const user = await UserModel.findById(id);
  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }
  // console.info(user);
  return user;
};

export default { register, login, me };
