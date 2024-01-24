import { createEnv } from "@t3-oss/env-core";
import * as dotenv from "dotenv";
import { ZodError, z } from "zod";
dotenv.config({
  path: `.env.local`,
  override: true,
});

export const env = createEnv({
  server: {
    // VERCEL
    VERCEL_ENV: z.enum(["development", "preview", "production"], {
      required_error: "VERCEL_ENV is required",
    }),
    // NEON
    PGHOST: z.string({
      required_error: "PGHOST is required",
    }),
    PGUSER: z.string({
      required_error: "PGUSER is required",
    }),
    PGDATABASE: z.string({
      required_error: "PGDATABASE is required",
    }),
    PGPASSWORD: z.string({
      required_error: "PGPASSWORD is required",
    }),
    DATABASE_URL: z.string({
      required_error: "DATABASE_URL is required",
    }),
    // NEXT AUTH
    NEXTAUTH_URL: z.string({
      required_error: "NEXTAUTH_URL is required",
    }),
    NEXTAUTH_SECRET: z.string({
      required_error: "NEXTAUTH_SECRET is required",
    }),
    FACEBOOK_CLIENT_ID: z.string({
      required_error: "FACEBOOK_CLIENT_ID is required",
    }),
    FACEBOOK_CLIENT_SECRET: z.string({
      required_error: "FACEBOOK_CLIENT_SECRET is required",
    }),
    GOOGLE_CLIENT_ID: z.string({
      required_error: "GOOGLE_CLIENT_ID is required",
    }),
    GOOGLE_CLIENT_SECRET: z.string({
      required_error: "GOOGLE_CLIENT_SECRET is required",
    }),
    LINE_CLIENT_ID: z.string({
      required_error: "LINE_CLIENT_ID is required",
    }),
    LINE_CLIENT_SECRET: z.string({
      required_error: "LINE_CLIENT_SECRET is required",
    }),
    SMTP_USERNAME: z.string({
      required_error: "SMTP_USERNAME is required",
    }),
    SMTP_PASSWORD: z.string({
      required_error: "SMTP_PASSWORD is required",
    }),
  },
  runtimeEnv: {
    VERCEL_ENV: process.env.VERCEL_ENV,
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    PGDATABASE: process.env.PGDATABASE,
    PGPASSWORD: process.env.PGPASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/`
      : undefined,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    LINE_CLIENT_ID: process.env.LINE_CLIENT_ID,
    LINE_CLIENT_SECRET: process.env.LINE_CLIENT_SECRET,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  },
  onValidationError: (error) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  },
  onInvalidAccess: (variable) => {
    throw new Error(
      "❌ Attempted to access a server-side environment variable on the client"
    );
  },
});

export const getDBUrl = () => {
  const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD } = env;
  return `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;
};

export const getPoolDBUrl = () => {
  const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD } = env;
  const PG_HOST_PARTS = PGHOST.split(".");
  const POOL_PGHOST =
    PG_HOST_PARTS[0] + "-pooler." + PG_HOST_PARTS.slice(1).join(".");
  return `postgres://${PGUSER}:${PGPASSWORD}@${POOL_PGHOST}/${PGDATABASE}?sslmode=require&pool=true`;
};
