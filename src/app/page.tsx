"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
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
          <Link
            href="/auth/account"
            className={buttonVariants({
              variant: "secondary",
            })}
          >
            Manage Account
          </Link>
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
