import { ReactNode } from "react";
import { PostHogProvider } from "./posthog";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "./nextauth";
import { getServerAuthSession } from "@/server/modules/auth/server";
import { TRPCReactProvider } from "./trpc";

export async function Provider({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();
  return (
    <SessionProvider session={session}>
      <TRPCReactProvider>
        <PostHogProvider>
          {children}
          <Toaster richColors />
        </PostHogProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
