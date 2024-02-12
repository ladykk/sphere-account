import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { SendEmailSection } from "./_component/send-email";
import {
  ChangePasswordSection,
  InvalidToken,
} from "./_component/change-password";
import { api } from "@/trpc/server";

// Token - Secret
// Link ใน Email - /auth/reset-password?token=secret

export default async function ResetPasswordPage(props: {
  searchParams: {
    token?: string;
  };
}) {
  const token = props.searchParams.token;
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { data: session } = useSession();

  // If session exists, redirect to callbackUrl
  useEffect(() => {
    if (session?.user) router.replace(callbackUrl);
  }, [session]);

  // ถ้าไม่มี Token ให้แสดงหน้า SendEmailSection
  if (!token) return <SendEmailSection />;

  const isValidToken = await api.auth.getResetPasswordTokenExpire.query(token);

  // ถ้า Token ไม่ถูกต้อง ให้แสดงหน้า InvalidToken
  if (!isValidToken) return <InvalidToken />;
  // ถ้า Token ถูกต้อง ให้แสดงหน้า ChangePasswordSection
  else return <ChangePasswordSection token={token} />;
}
