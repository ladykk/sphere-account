import { env } from "@/env/server.mjs";
import { render } from "jsx-email";
import nodemailer from "nodemailer";
import { JSXElementConstructor, ReactElement } from "react";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});

export async function sendMail<P>(
  to: string,
  subject: string,
  email: ReactElement<P, string | JSXElementConstructor<P>>
) {
  return await transporter.sendMail({
    from: env.SMTP_USERNAME,
    to,
    subject,
    html: await render(email),
  });
}
