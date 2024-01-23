import { ReactNode } from "react";
import { PostHogProvider } from "./posthog";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "./nextauth";
import { getServerAuthSession } from "@/server/modules/auth/server";

export async function Provider({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();
  return (
    <SessionProvider session={session}>
      <PostHogProvider>
        {children}
        <Toaster />
      </PostHogProvider>
    </SessionProvider>
  );
}
