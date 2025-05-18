import nodemailer from "nodemailer";

export const smtp = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "suportealejandrog@gmail.com",
    pass: process.env.PASSWORD_SMTP,
  },
  tls: {
    rejectUnauthorized: true,
  },
});
