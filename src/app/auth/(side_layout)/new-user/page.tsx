"use client";
import { Input } from "@/components/ui/input";
import emailIcon from "@/assets/icon/email.svg";
import { Button } from "@/components/ui/button";
import { handleTRPCFormError } from "@/lib/utils";
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

import { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useEffectOnce } from "usehooks-ts";

export default function newUserPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const router = useRouter();
  const { data: session, update } = useSession();

  const form = useForm<RouterInputs["auth"]["updateAccount"]>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      image: "",
    },
  });

  const mutation = api.auth.updateAccount.useMutation({
    onSuccess: () => router.replace(callbackUrl),
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
  });

  useEffectOnce(() => {
    var firstName: string = "";
    var lastName: string = "";
    if (!session) {
      console.log("No session");
    } else {
      if (session?.user.name) {
        console.log("Start : " + session.user.name);
        const position: number = session.user.name.search(" ");
        firstName = session?.user.name?.substring(0, position);
        lastName = session?.user.name?.substring(
          position,
          session?.user.name?.length
        );
      }
      form.reset({
        email: session?.user.email ?? "",
        firstName: firstName,
        lastName: lastName,
        image: session.user.image ?? "",
      });
    }
  });

  useEffect(() => {
    if (!session?.user) router.replace(callbackUrl);
  }, [session]);

  const onUpdate = async (input: RouterInputs["auth"]["updateAccount"]) => {
    await mutation.mutateAsync(input); // Wait for the account update to finish
    upDateSess(); // Once the account update is finished, update the session
    toast.promise(
      Promise.resolve(), // No need to toast anything here, since the session is updated separately
      {
        loading: "Updating account...",
        success: "Account updated successfully!",
        error: "Failed to update account",
      }
    );
  };

  const upDateSess = () => {
    update({
      name: form.getValues("firstName") + " " + form.getValues("lastName"),
      email: form.getValues("email"),
    });
  };

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onUpdate)}>
        {" "}
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
                    <Input
                      {...field}
                      placeholder="First Name"
                      disabled={!!form.getValues("firstName")}
                    />
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
                    <Input
                      {...field}
                      placeholder="Last Name"
                      disabled={!!form.getValues("lastName")}
                    />
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
                    disabled={!!form.getValues("email")}
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
