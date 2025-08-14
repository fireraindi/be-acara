import nodemailer from "nodemailer";
import {
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_SECURE,
  EMAIL_SMTP_SERVICE_NAME,
  EMAIL_SMTP_USER,
} from "../env.js";
import Mustache from "mustache";
import * as fs from "fs/promises";
import path = require("path");

// console.info(EMAIL_SMTP_USER);
// console.info(EMAIL_SMTP_PASS);
// console.info(EMAIL_SMTP_SECURE);
// console.info(EMAIL_SMTP_PORT);
// console.info(EMAIL_SMTP_SERVICE_NAME);
// console.info(EMAIL_SMTP_HOST);

const transporter = nodemailer.createTransport({
  service: EMAIL_SMTP_SERVICE_NAME,
  host: EMAIL_SMTP_HOST,
  port: EMAIL_SMTP_PORT,
  secure: EMAIL_SMTP_SECURE,
  auth: {
    user: EMAIL_SMTP_USER,
    pass: EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

export interface SendMail {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({ ...send }: SendMail) => {
  const result = await transporter.sendMail({
    ...send,
  });
  return result;
};

export const renderMailContent = async (template: string, data: any) => {
  // const file = Bun.file(`./templates/${template}`);
  // const content = await file.text();
  const content = await fs
    .readFile(path.join(__dirname + `/templates/${template}`))
    .then((data) => data.toString());

  const render = Mustache.render(content, data);

  return render;
};
