"use client";
import { Input } from "@/components/ui/input";
import emailIcon from "@/assets/icon/email.svg";
import lockKey from "@/assets/icon/padlock.png";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn, handleTRPCFormError } from "@/lib/utils";
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
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { BlockInteraction } from "@/components/ui/spinner";
import { SignInParams, useSignInMutation } from "@/hooks/auth";
import { useEffect } from "react";
import { sessions } from "@/db/schema/auth";
import { useSession } from "next-auth/react";
import { useEffectOnce } from "usehooks-ts";

export default function newUserPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  const { data: session, status, update } = useSession();
  
  const form = useForm<RouterInputs["auth"]["updateAccount"]>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      image: "",
    },
  });

  const loginPath = `/auth/login${
    callbackUrl ? `?callbackUrl=${callbackUrl}` : ""
  }`;

  const mutation = api.auth.updateAccount.useMutation({
    onSuccess: () => router.replace(loginPath),
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
  });

  const signInMutation = useSignInMutation();

  const testUpdateClick = (input: RouterInputs["auth"]["updateAccount"]) => {
    console.log("Test Update Click!! : " + input.email);
    // router.replace(`/auth/account`);
  };

  useEffectOnce(() => {
    var firstName: string = "";
    var lastName: string = "";
    if (!session) {
      console.log("No session");
    } else {
      if (session?.user.name) {
        const position: number = session?.user.name?.search(" ");
        firstName = session?.user.name?.substring(0, position);
        lastName = session?.user.name?.substring(
          position,
          session?.user.name?.length
        );
        console.log(
          "have session : " +
            session?.user.email +
            " : " +
            firstName +
            " : " +
            lastName
        );
      }

      form.reset({
        email: String(session?.user.email),
        firstName: firstName,
        lastName: lastName,
        image: "",
      });
    }
  });
  // useEffect(() => {});

  const onSubmit = async (input: RouterInputs["auth"]["updateAccount"]) => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Creating account...",
      success: "Account created successfully!",
      error: "Failed to create account",
    });
  };

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(testUpdateClick)}>
        {" "}
        {/* test fix */}
        <BlockInteraction isBlock={mutation.isPending} />
        <h1 className="mb-4">Complete Information </h1>
        <h5 className="text-muted-foreground mb-4">
          Enter your information below to continue.
        </h5>
        <div className="space-y-4 mt-3">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input {...field} placeholder="First Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input {...field} placeholder="Last Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email"
                    prefixIcon={emailIcon}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-8">Update</Button>
      </form>
    </Form>
  );
}
