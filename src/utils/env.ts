// export const DATABASE_URL: string = Bun.env.DATABASE_URL || "";
// export const JWT_SECRET: string = Bun.env.JWT_SECRET || "";
//nodemailer
// export const EMAIL_SMTP_SECURE: boolean =
//   Boolean(Bun.env.EMAIL_SMTP_SECURE) || false;
// export const EMAIL_SMTP_PASS: string = Bun.env.EMAIL_SMTP_PASS || "";
// export const EMAIL_SMTP_USER: string = Bun.env.EMAIL_SMTP_USER || "";
// export const EMAIL_SMTP_PORT: number = Number(Bun.env.EMAIL_SMTP_PORT) || 0;
// export const EMAIL_SMTP_HOST: string = Bun.env.EMAIL_SMTP_HOST || "";
// export const EMAIL_SMTP_SERVICE_NAME: string =
//   Bun.env.EMAIL_SMTP_SERVICE_NAME || "";

// export const CLIENT_HOST: string = Bun.env.CLIENT_HOST || "";

export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
// export const APP_TEST: boolean = Boolean(process.env.APP_TEST) || false;

//nodemailer
export const EMAIL_SMTP_SECURE: boolean =
  Boolean(process.env.EMAIL_SMTP_SECURE) || false;
export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER || "";
export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS || "";
export const EMAIL_SMTP_PORT: number = Number(process.env.EMAIL_SMTP_PORT) || 0;
export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST || "";
export const EMAIL_SMTP_SERVICE_NAME: string =
  process.env.EMAIL_SMTP_SERVICE_NAME || "";
export const CLIENT_HOST: string = process.env.CLIENT_HOST || "";
