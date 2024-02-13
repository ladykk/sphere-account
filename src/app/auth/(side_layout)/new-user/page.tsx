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
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function newUserPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const router = useRouter();
  const { data: session, update } = useSession({
    required: true,
  });

  const form = useForm<RouterInputs["auth"]["updateAccount"]>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      image: "",
    },
  });

  const mutation = api.auth.updateAccount.useMutation({
    onSuccess: async () => {
      await update();
      router.replace(callbackUrl);
    },
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
  });

  useEffect(() => {
    if (!session) return;

    // If the user is already logged in, we can pre-fill the form with their information
    let firstName = "";
    let lastName = "";
    if (session?.user.name) {
      const position: number = session.user.name.search(" ");
      firstName = session?.user.name?.substring(0, position);
      lastName = session?.user.name?.substring(
        position,
        session?.user.name?.length
      );
    }
    form.reset({
      email: session?.user.email ?? "",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      image: session.user.image ?? "",
    });
  }, []);

  const onUpdate = async (input: RouterInputs["auth"]["updateAccount"]) => {
    toast.promise(
      mutation.mutateAsync(input), // No need to toast anything here, since the session is updated separately
      {
        loading: "Updating account...",
        success: "Account updated successfully!",
        error: "Failed to update account",
      }
    );
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
