"use client";
import { useState } from "react";
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

export function SendEmailSection() {
  const [email, setEmail] = useState<string | undefined>(undefined);

  const handleAfterSendEmail = (email: string) => setEmail(email);

  if (!email) return <Step1 onSuccess={handleAfterSendEmail} />;

  return <Step2 email={email} />;
}

function Step1(props: { onSuccess: (email: string) => void }) {
  const form = useForm<RouterInputs["auth"]["sendResetPasswordEmail"]>({
    defaultValues: {
      email: "",
    },
  });

  const mutation = api.auth.sendResetPasswordEmail.useMutation({
    onSuccess: (_, variable) => props.onSuccess(variable.email),
  });

  const onSubmit = async (
    input: RouterInputs["auth"]["sendResetPasswordEmail"]
  ) => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Sending Email...",
      success: "Email has already been sent",
      error: "Failed to send email",
    });
  };

  return (
    <Form {...form}>
      {" "}
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
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
                  {...field}
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

export function Step2(props: { email: string }) {
  const mutation = api.auth.sendResetPasswordEmail.useMutation({});
  return (
    <div className="w-full">
      <h1 className="mb-6">Reset password</h1>
      <h4 className="mb-5">
        Password reset information has sent to <br></br> {props.email}
      </h4>
      <p className=" text-center text-neutral-600">
        Didn’t receive the email? Check spam folder or
      </p>
      <Button
        className="w-full my-4"
        size="lg"
        onClick={() => mutation.mutateAsync({ email: props.email })}
      >
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
