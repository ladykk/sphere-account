"use client";

import emailIcon from "@/asset/icon/email.svg";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignalZero } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import lockKey from "@/asset/icon/padlock.png";

export default function newpassword() {
  return (
    <div className="w-full">
      <h1 className="mb-6">Reset password</h1>
      <h4 className="mb-5">
        Enter the email you used to create you account so we will send
        [condition]
      </h4>
      <p className="mb-2 text-lg">New Password</p>
      <Input
        prefixIcon={lockKey}
        placeholder="Password"
        inputSize="xl"
        type="password"
      />
      <p className="my-2 text-lg">Confirm Password</p>
      <Input
        prefixIcon={lockKey}
        placeholder="Confirm Password"
        inputSize="xl"
        type="password"
      />
      <Button className="w-full my-4" size="lg">
        Send
      </Button>
      <Link
        href="/auth/login"
        className={cn(
          buttonVariants({ variant: "link", size: "lg" }),
          "w-full text-black bg-white border border-gray-300 hover:bg-black hover:text-white hover:no-underline"
        )}
      >
        Back to Login
      </Link>
    </div>
  );
}
