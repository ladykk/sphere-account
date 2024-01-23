import { createEnv } from "@t3-oss/env-core";
import * as dotenv from "dotenv";
import { z } from "zod";
dotenv.config({
  path: `.env.local`,
  override: true,
});

export const dbEnv = createEnv({
  server: {
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
  },
  isServer: typeof window === "undefined",
  clientPrefix: "NEXT_PUBLIC_",
  client: {},
  runtimeEnv: process.env,
});

export const getDBUrl = () => {
  const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD } = dbEnv;
  return `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;
};

export const getPoolDBUrl = () => {
  const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD } = dbEnv;
  const PG_HOST_PARTS = PGHOST.split(".");
  const POOL_PGHOST =
    PG_HOST_PARTS[0] + "-pooler." + PG_HOST_PARTS.slice(1).join(".");
  return `postgres://${PGUSER}:${PGPASSWORD}@${POOL_PGHOST}/${PGDATABASE}?sslmode=require&pool=true`;
};
