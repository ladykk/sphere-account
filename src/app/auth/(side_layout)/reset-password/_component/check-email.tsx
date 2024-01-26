"use client";

import emailIcon from "@/asset/icon/email.svg";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignalZero } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function checkEmail() {
  return (
    <div className="w-full">
      <h1 className="mb-6">Reset password</h1>
      <h4 className="mb-5">
        Password reset information has sent to <br></br> [email]
      </h4>
      <p className=" text-center text-neutral-600">
        Didn’t receive the email? Check spam folder or
      </p>
      <Button className="w-full my-4" size="lg">
        Resend Email
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
