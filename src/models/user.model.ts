import mongoose, { Types } from "mongoose";

export interface User {
  id: Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
}

const Schema = mongoose.Schema;
const UserSchema = new Schema<User>(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    profilePicture: {
      type: Schema.Types.String,
      required: true,
      default: "profile.jpg",
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: false,
      required: true,
    },
    activationCode: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJson = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
const UserModel = mongoose.model("User", UserSchema);

export type RegisterRequest = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginRequest = {
  identifier: string;
  password: string;
};

export default UserModel;
