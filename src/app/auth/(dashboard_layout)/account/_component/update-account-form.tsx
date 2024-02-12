"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getNamePrefix } from "@/lib/auth";
import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

// Assets
import email from "@/assets/icon/email.svg";
import { Button } from "@/components/ui/button";
import { BlockInteraction } from "@/components/ui/spinner";
import { AvatarInput } from "@/components/auth/avatar-input";
import { toast } from "sonner";
import { fileToPresignedUrlInput, uploadFile } from "@/lib/file";
import { useMutation } from "@tanstack/react-query";
import { handleTRPCFormError } from "@/lib/utils";

type TForm = RouterInputs["auth"]["updateAccount"] & {
  files: {
    image: File | null;
  };
};

export function UpdateAccountForm() {
  const { data: session, status, update } = useSession();
  const form = useForm<TForm>({
    defaultValues: {
      firstName: session?.user.name?.split(" ")?.[0] ?? "",
      lastName: session?.user.name?.split(" ")?.[1] ?? "",
      email: session?.user.email ?? "",
      image: session?.user.image ?? "",
      files: {
        image: null,
      },
    },
  });

  const updateAccountMutation = api.auth.updateAccount.useMutation({
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
  });
  const presignImageMutation = api.auth.generateImagePresignedUrl.useMutation();
  const mutation = useMutation<void, Error, TForm>({
    mutationFn: async (input) => {
      let { files, ...data } = input;

      // Upload image
      if (files.image) {
        const presignedUrl = await presignImageMutation.mutateAsync([
          fileToPresignedUrlInput(files.image),
        ]);

        data.image = (
          await uploadFile(presignedUrl[0], files.image).catch((err) => {
            form.setError("files.image", {
              type: "manual",
              message: "Failed to upload image.",
            });
            throw err;
          })
        ).url;
      }

      // Update account
      await updateAccountMutation.mutateAsync(data);

      setTimeout(async () => {
        await update();
      }, 1000);
    },
  });

  useEffect(() => {
    if (!session) return;

    form.reset({
      firstName: session.user.name?.split(" ")?.[0] ?? "",
      lastName: session.user.name?.split(" ")?.[1] ?? "",
      email: session.user.email ?? "",
      image: session.user.image ?? "",
    });
  }, [session]);

  const onSubmit = async (input: TForm) => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Updating your account...",
      success: "Account updated successfully!",
      error: "Failed to update your account.",
    });
  };

  return (
    <Form {...form}>
      <form className="flex-1" onSubmit={form.handleSubmit(onSubmit)}>
        <BlockInteraction
          isBlock={status === "loading" || mutation.isPending}
        />
        <h3 className="mb-5">General Infomation</h3>
        <div className="flex gap-5">
          <FormField
            control={form.control}
            name="files.image"
            render={({ field }) => (
              <div>
                <FormControl>
                  <AvatarInput {...field}>
                    {(fileUrl) => (
                      <Avatar className="w-32 h-32 rounded-md border shadow border-input cursor-pointer hover:opacity-70 transition-opacity">
                        <AvatarImage
                          src={fileUrl ?? session?.user.image ?? ""}
                        />
                        <AvatarFallback className="text-3xl rounded-md">
                          {getNamePrefix(session?.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </AvatarInput>
                </FormControl>
                {!field.value && (
                  <p className="w-full text-center text-xs mt-2 text-muted-foreground">
                    Click to upload
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex flex-col gap-3 flex-1">
            <div className="flex gap-3">
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
                      prefixIcon={email}
                      placeholder="Email Address"
                      disabled={!!session?.user.email}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-fit" disabled={!form.formState.isDirty}>
              Update
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
