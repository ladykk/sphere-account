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
import { useForm } from "react-hook-form";
import { RouterInputs } from "@/trpc/shared";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

export function ChangePassword(props: { token: string }) {
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);
  const handleSubmitNewPassword = () => setIsSuccess(true);

  if (!isSuccess)
    return (
      <InputNewPassword
        onSuccess={handleSubmitNewPassword}
        token={props.token}
      />
    );

  return <SuccessResetPassword />;
}

export function InputNewPassword(props: {
  onSuccess: (isSuccess: boolean) => void;
  token: string;
}) {
  const form = useForm<RouterInputs["auth"]["resetPassword"]>({
    defaultValues: {
      token: props.token,
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = api.auth.resetPassword.useMutation({
    // onSuccess: () => {
    //   const isSuccess = true;
    // },
  });

  const onSubmit = async (input: RouterInputs["auth"]["resetPassword"]) => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Changing password...",
      success: "Password change successfully!",
      error: "Failed to change password",
    });
    console.log(props.token);
  };

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-6">Reset password {props.token}</h1>
        <h4 className="mb-5">
          Enter the email you used to create you account so we will send
          [condition]
        </h4>
        <p className="mb-2 text-lg">New Password</p>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  prefixIcon={lockKey}
                  placeholder="Password"
                  inputSize="xl"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <p className="my-2 text-lg">Confirm Password</p>
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  prefixIcon={lockKey}
                  placeholder="Confirm Password"
                  inputSize="xl"
                  type="password"
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

export function SuccessResetPassword() {
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
