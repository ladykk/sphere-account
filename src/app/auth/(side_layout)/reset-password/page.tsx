import emailIcon from "@/asset/icon/email.svg";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignalZero } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function page() {
  return (
    <div className="w-full">
      <h1 className="mb-6">Reset password</h1>
      <h4 className="mb-5">
        Enter the email you used to create you account so we will send
        [condition]
      </h4>
      <Input prefixIcon={emailIcon} placeholder="Email" inputSize="xl" />
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
