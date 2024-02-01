"use client";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn, handleTRPCFormError } from "@/lib/utils";
import lockKey from "@/assets/icon/padlock.png";
import success from "@/assets/icon/success.svg";
import error from "@/assets/icon/error.svg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { RouterInputs } from "@/trpc/shared";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";
import { BlockInteraction } from "@/components/ui/spinner";

export function ChangePasswordSection(props: { token: string }) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const handleSuccess = () => setIsSuccess(true);

  if (!isSuccess)
    return <NewPasswordForm onSuccess={handleSuccess} token={props.token} />;

  return <Success />;
}

function NewPasswordForm(props: { onSuccess: () => void; token: string }) {
  const form = useForm<RouterInputs["auth"]["resetPassword"]>({
    defaultValues: {
      token: props.token,
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = api.auth.resetPassword.useMutation({
    onSuccess: () => props.onSuccess(),
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
  });

  const onSubmit = async (input: RouterInputs["auth"]["resetPassword"]) => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Changing password...",
      success: "Password change successfully!",
      error: "Failed to change password",
    });
  };

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <BlockInteraction isBlock={mutation.isPending} />
        <h1 className="mb-6">Reset Password</h1>
        <h5 className="mb-5 text-muted-foreground">Enter your new password.</h5>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  prefixIcon={lockKey}
                  placeholder="Password"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  prefixIcon={lockKey}
                  placeholder="Confirm Password"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <Button className="w-full mb-4">Reset Password</Button>
        <Link
          href="/auth/login"
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          Back to Login
        </Link>
      </form>
    </Form>
  );
}

function Success() {
  return (
    <div className="w-full">
      <h1 className="mb-6">Reset Password Successfully</h1>
      <div className=" flex justify-center my-9">
        <Image src={success} alt="success" width={128} height={128} />
      </div>
      <Link
        href="/auth/login"
        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
      >
        Back to Login
      </Link>
    </div>
  );
}

export function InvalidToken() {
  return (
    <div className="w-full">
      <h1 className="mb-6">Invalid Token</h1>
      <div className=" flex justify-center my-9">
        <Image src={error} alt="error" width={128} height={128} />
      </div>
      <Link
        href="/auth/reset-password"
        className={cn(buttonVariants({}), "w-full mb-4")}
      >
        Get Reset Password Email
      </Link>
      <Link
        href="/auth/login"
        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
      >
        Back to Login
      </Link>
    </div>
  );
}
