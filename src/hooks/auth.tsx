"use client";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type SignInParams =
  | {
      type: "line" | "google" | "facebook";
      isRemember: boolean;
    }
  | {
      type: "email-password";
      credentials: {
        email: string;
        password: string;
      };
      isRemember: boolean;
    };

const handleError = (error: string) => {
  switch (error) {
    case "CredentialsSignin":
      toast.error("Invalid email or password.");
      break;
    case "SessionRequired":
      toast.error("Please login to continue.");
      break;
    case "OAuthAccountNotLinked":
      toast.error(
        "To confirm your identity, please login with the same account that you used originally."
      );
      break;
    case "OAuthSignin":
    case "OAuthCallback":
    default:
      toast.error(
        "An error occurred while logging in, please try again later."
      );
  }
};

export const useSignInMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, SignInParams>,
    "mutationKey" | "mutationFn"
  >
) => {
  const searchParams = useSearchParams();
  const [isLoaded, setLoaded] = useState(false);

  // Wait until client is ready
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Show error if any
  useEffect(() => {
    if (!isLoaded) return;
    const error = searchParams.get("error");
    if (!error) return;
    handleError(error);
  }, [searchParams, isLoaded]);

  const mutation = useMutation<void, Error, SignInParams>({
    mutationKey: ["signIn"],
    mutationFn: async (params) => {
      const result = await signIn(params.type, {
        callbackUrl: searchParams.get("callbackUrl") ?? "/",
        email:
          params.type === "email-password"
            ? params.credentials.email
            : undefined,
        password:
          params.type === "email-password"
            ? params.credentials.password
            : undefined,
      });
      if (result?.error) {
        throw new Error(result.error);
      }

      await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
    },
    ...options,
  });

  return mutation;
};
