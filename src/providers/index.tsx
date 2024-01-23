import { ReactNode } from "react";
import { PostHogProvider } from "./posthog";
import { Toaster } from "@/components/ui/sonner";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider>
      {children}
      <Toaster />
    </PostHogProvider>
  );
}
