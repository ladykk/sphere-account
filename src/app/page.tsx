"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="p-5">
      <h1>Sphere Account</h1>
      {session ? (
        <>
          <p>{session.user.id}</p>
          <Button
            onClick={() =>
              toast.promise(signOut, {
                loading: "Signing out...",
                success: "Signed out",
                error: "Failed to sign out",
              })
            }
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Button
          onClick={() =>
            toast.promise(signIn, {
              loading: "Redirecting to sign in...",
              success: undefined,
              error: "Failed to sign in",
            })
          }
        >
          Sign In
        </Button>
      )}
    </main>
  );
}
