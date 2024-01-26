"use client";

import emailIcon from "@/asset/icon/email.svg";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignalZero } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import lockKey from "@/asset/icon/padlock.png";
import success from "@/asset/image/success.png";
import Image from "next/image";

export default function successResetPassword() {
  return (
    <div className="w-full">
      <h1 className="mb-6">Reset password successfully</h1>
      <div className=" flex justify-center my-9">
        <Image src={success} alt="success" />{" "}
      </div>

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
