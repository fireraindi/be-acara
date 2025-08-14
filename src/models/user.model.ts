import mongoose, { Types } from "mongoose";
import { renderMailContent, sendMail } from "../utils/mail/mail.js";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env.js";
import crypto from "crypto";
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
  createdAt?: string;
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
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
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

UserSchema.pre("save", function (next) {
  const user: User = this!;
  user.activationCode = crypto.randomBytes(32).toString("hex");

  next();
});

let isTest = false;
export const setIsTest = (newValue: boolean) => {
  isTest = newValue;
};
export const getIsTest = () => isTest;
if (!getIsTest) {
  UserSchema.post("save", async (doc, next) => {
    try {
      const user = doc;
      // console.info(`send email to ${user.email}`);
      const contentMail = await renderMailContent(
        "registration_success.mustache",
        {
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
          activationLink: `${CLIENT_HOST}/api/auth/activation?code=${user.activationCode}`,
        }
      );
      // console.info("content mail=" + contentMail);
      await sendMail({
        from: EMAIL_SMTP_USER,
        to: user.email,
        subject: "Aktivasi Akun Anda",
        html: contentMail,
      });
    } catch (error) {
      console.info(error);
    } finally {
      next();
    }
  });
}
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
