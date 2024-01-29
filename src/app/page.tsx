"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="p-5">
      <h1>Sphere Account</h1>
      {session ? (
        session.user.id
      ) : (
        <Button onClick={() => signIn()}>Sign In</Button>
      )}
    </main>
  );
}
