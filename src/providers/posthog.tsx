"use client";
import { env } from "@/env/client.mjs";
import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { ReactNode } from "react";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_API_HOST,
    ui_host: env.NEXT_PUBLIC_POSTHOG_UI_HOST,
    capture_pageview: false,
  });
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  return <Provider client={posthog}>{children}</Provider>;
}
