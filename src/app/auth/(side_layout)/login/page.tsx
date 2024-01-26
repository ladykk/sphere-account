"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import emailIcon from "@/asset/icon/email.svg";
import lockKey from "@/asset/icon/padlock.png";
import facebookLogo from "@/asset/image/facebookLogo.png";
import googleLogo from "@/asset/image/googleLogo.png";
import lineLogo from "@/asset/image/lineLogo.png";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SignInParams, useSignInMutation } from "@/hooks/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const mutation = useSignInMutation({
    onSuccess: () => router.replace(callbackUrl || "/"),
  });

  const form = useForm<SignInParams>({
    defaultValues: {
      type: "email-password",
      isRemember: false,
    },
  });

  const onSubmit = (input: SignInParams) => {
    // CASE: Email & Password
    if (input.type === "email-password") {
      let isPass = true;
      // Validate form
      if (!input.credentials.email) {
        // Validate email
        form.setError("credentials.email", {
          type: "required",
          message: "Email is required",
        });
        isPass = false;
      }

      if (!input.credentials.password) {
        // Validate password
        form.setError("credentials.password", {
          type: "required",
          message: "Password is required",
        });
        isPass = false;
      }

      if (!isPass) return;

      // Submit form
      mutation.mutate(input);
      toast.loading("Logging in...", {
        duration: 1000 * 10,
      });
    } else {
      form.setValue("isRemember", true);
      mutation.mutate(input);
      toast.loading("Redirecting to login provider...", {
        duration: 1000 * 10,
      });
    }
  };

  return (
    <Form {...form}>
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-2">Login to your account</h1>
        <h5 className="text-muted-foreground ">Login in with your email</h5>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="credentials.email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    prefixIcon={emailIcon}
                    placeholder="Email Address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="credentials.password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    prefixIcon={lockKey}
                    placeholder="Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center w-full gap-8 px-2">
          <Separator className="flex-1 bg-muted-foreground text-sm" />
          <p>or continue with</p>
          <Separator className="flex-1 bg-muted-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            type="button"
            onClick={() => onSubmit({ type: "google", isRemember: false })}
          >
            <Image src={googleLogo} alt="Google" className="w-5 h-5" />
            Google
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            type="button"
            onClick={() => onSubmit({ type: "facebook", isRemember: false })}
          >
            <Image src={facebookLogo} alt="Facebook" className="w-5 h-5" />
            Facebook
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            type="button"
            onClick={() => onSubmit({ type: "line", isRemember: false })}
          >
            <Image src={lineLogo} alt="LINE" className="w-5 h-5" />
            LINE
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <FormField
            control={form.control}
            name="isRemember"
            render={({ field }) => (
              <FormItem className="flex gap-3 items-center space-y-0">
                <FormControl>
                  <Checkbox {...field} />
                </FormControl>
                <Label className="font-normal">Remember me</Label>
              </FormItem>
            )}
          />

          <Link
            href="/auth/reset-password"
            className={cn(buttonVariants({ variant: "link" }), "font-normal")}
          >
            Forget Password?
          </Link>
        </div>
        <Button className="w-full my-8">Login</Button>
        <div className="flex justify-center gap-6 items-center text-sm">
          <div>Don't have an account? </div>
          <Link
            href={`/auth/register${
              callbackUrl ? `?callbackUrl=${callbackUrl}` : ""
            }`}
            className={cn(buttonVariants({ variant: "link" }), "font-normal")}
          >
            Create an account
          </Link>
        </div>
      </form>
    </Form>
  );
}
