"use client";
import { Session } from "next-auth";
import { SessionProvider as Provider } from "next-auth/react";
import { ReactNode } from "react";

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <Provider session={session} refetchInterval={5 * 60} refetchOnWindowFocus>
      {children}
    </Provider>
  );
}
