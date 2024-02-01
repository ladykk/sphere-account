"use client";
import { useEffect, useState } from "react";
import emailIcon from "@/assets/icon/email.svg";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { BlockInteraction } from "@/components/ui/spinner";

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
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <BlockInteraction isBlock={mutation.isPending} />
        <h1 className="mb-6">Reset Password</h1>
        <h5 className="mb-5 text-muted-foreground">
          Enter the email that you used to create your account. You will receive
          a link to reset your password via email.
        </h5>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  prefixIcon={emailIcon}
                  placeholder="Email Address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <Button className="w-full my-4">Send</Button>
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

function Step2(props: { email: string }) {
  const [counter, setCounter] = useState(10);
  const mutation = api.auth.sendResetPasswordEmail.useMutation({
    onSuccess: () => setCounter(10),
  });

  useEffect(() => {
    if (counter === 0) return;
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter]);

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
    <div className="w-full">
      <BlockInteraction isBlock={mutation.isPending} />
      <h1 className="mb-6">Reset Password</h1>
      <h5 className="mb-5 text-muted-foreground">
        A link to reset your password has been sent to "{props.email}". Please
        check your inbox to continue.
      </h5>
      <p className=" text-center text-neutral-600">
        Didn’t receive the email? Check spam folder or...
      </p>
      <Button
        className="w-full my-4"
        size="lg"
        onClick={() => onSubmit({ email: props.email })}
        disabled={counter > 0}
      >
        Resend Email {counter > 0 ? `(${counter})` : ""}
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
