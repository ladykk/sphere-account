"use client";
import { signOut, useSession } from "next-auth/react";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { AvatarMenu } from "./avatar-menu";

export default function AuthMenu() {
  const { data: session, status } = useSession();

  return (
    <div className="w-[300px] flex justify-end gap-3 items-center">
      {status === "loading" ? (
        <Spinner className="w-6 h-6" />
      ) : status === "unauthenticated" ? (
        <>
          <Button>Login</Button>
          <Button variant="outline">Register</Button>
        </>
      ) : (
        <>
          {/* TODO: Implement Auth Dropdown */}
          <p>
            {session?.user.name || session?.user.email || "No Registered Name"}
          </p>
          <AvatarMenu />
        </>
      )}
    </div>
  );
}
