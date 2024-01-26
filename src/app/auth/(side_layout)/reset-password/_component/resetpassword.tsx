"use client";

import emailIcon from "@/asset/icon/email.svg";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignalZero } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { RouterInputs } from "@/trpc/shared";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export default function resetpassword() {
  const form = useForm<RouterInputs["auth"]["sendResetPasswordEmail"]>({
    defaultValues: {
      email: "",
    },
  });

  const mutation = api.auth.sendResetPasswordEmail.useMutation({});

  // const OnSubmit = async (Input: RouterInputs["auth"]["sendResetPasswordEmail"]) => {

  // }

  return (
    <Form {...form}>
      {" "}
      <form className="w-full">
        <h1 className="mb-6">Reset password</h1>
        <h4 className="mb-5">
          Enter the email you used to create you account so we will send
          [condition]
        </h4>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  prefixIcon={emailIcon}
                  placeholder="Email"
                  inputSize="xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

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
      </form>
    </Form>
  );
}
