"use client";
import { Input } from "@/components/ui/input";
import emailIcon from "@/assets/icon/email.svg";
import lockKey from "@/assets/icon/padlock.png";
import { Separator } from "@/components/ui/separator";
import facebookLogo from "@/assets/image/facebookLogo.png";
import googleLogo from "@/assets/image/googleLogo.png";
import lineLogo from "@/assets/image/lineLogo.png";
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

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  const form = useForm<RouterInputs["auth"]["register"]>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    },
  });

  const mutation = api.auth.register.useMutation({
    onSuccess: () => router.replace("/auth/login"),
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
  });

  const onSubmit = async (input: RouterInputs["auth"]["register"]) => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Creating account...",
      success: "Account created successfully!",
      error: "Failed to create account",
    });
  };

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <BlockInteraction isBlock={mutation.isPending} />
        <h1 className="mb-4">Register </h1>
        <h5 className="text-muted-foreground mb-4">
          Enter your information below to create your account
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Password"
                    prefixIcon={lockKey}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirm Password"
                    prefixIcon={lockKey}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center w-full gap-8 px-2 py-1">
            <Separator className="flex-1 bg-muted-foreground" />
            <p>or continue with</p>
            <Separator className="flex-1 bg-muted-foreground" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex-1 gap-2" type="button">
              <Image src={googleLogo} alt="Google" className="w-5 h-5" />
              Google
            </Button>
            <Button variant="outline" className="flex-1 gap-2" type="button">
              <Image src={facebookLogo} alt="Facebook" className="w-5 h-5" />
              Facebook
            </Button>
            <Button variant="outline" className="flex-1 gap-2" type="button">
              <Image src={lineLogo} alt="LINE" className="w-5 h-5" />
              Line
            </Button>
          </div>
        </div>
        <Button className="w-full my-9">Register</Button>
        <div className="flex justify-center gap-6 items-center text-sm">
          <div> Already have an account?</div>
          <Link
            href={`/auth/login${
              callbackUrl ? `?callbackUrl=${callbackUrl}` : ""
            }`}
            className={cn(buttonVariants({ variant: "link" }), "font-normal")}
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
