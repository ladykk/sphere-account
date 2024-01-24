import { env } from "@/env/server.mjs";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { JSXElementConstructor, ReactElement, ReactNode } from "react";

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
  html: ReactElement<P, string | JSXElementConstructor<P>>
) {
  return await transporter.sendMail({
    from: env.SMTP_USERNAME,
    to,
    subject,
    html: render(html),
  });
}
