import { createEnv } from "@t3-oss/env-core";
import * as dotenv from "dotenv";
import { z } from "zod";
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
  },
  isServer: typeof window === "undefined",
  clientPrefix: "NEXT_PUBLIC_",
  client: {},
  runtimeEnv: process.env,
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
