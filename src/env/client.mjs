"use client";
import { createEnv } from "@t3-oss/env-core";
import * as dotenv from "dotenv";
import { ZodError, z } from "zod";
dotenv.config({
  path: `.env.local`,
  override: true,
});

export const env = createEnv({
  clientPrefix: "NEXT_PUBLIC_",

  client: {
    NEXT_PUBLIC_POSTHOG_KEY: z.string({
      required_error: "NEXT_PUBLIC_POSTHOG_KEY is required",
    }),
    NEXT_PUBLIC_POSTHOG_API_HOST: z.string({
      required_error: "NEXT_PUBLIC_POSTHOG_API_HOST is required",
    }),
    NEXT_PUBLIC_POSTHOG_UI_HOST: z.string({
      required_error: "NEXT_PUBLIC_POSTHOG_UI_HOST is required",
    }),
  },
  runtimeEnv: {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_API_HOST: process.env.NEXT_PUBLIC_POSTHOG_API_HOST,
    NEXT_PUBLIC_POSTHOG_UI_HOST: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
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
