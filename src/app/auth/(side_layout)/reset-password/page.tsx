import { redirect } from "next/navigation";
import { SendEmailSection } from "./_component/send-email";
import {
  ChangePasswordSection,
  InvalidToken,
} from "./_component/change-password";
import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/modules/auth/server";

// Token - Secret
// Link ใน Email - /auth/reset-password?token=secret

export default async function ResetPasswordPage(props: {
  searchParams: {
    token?: string;
    callbackUrl?: string;
  };
}) {
  const token = props.searchParams.token;
  const callbackUrl = props.searchParams.callbackUrl || "/";
  const session = await getServerAuthSession();

  // ถ้ามี Session ให้ Redirect ไปที่ callbackUrl
  if (session) redirect(callbackUrl);

  // ถ้าไม่มี Token ให้แสดงหน้า SendEmailSection
  if (!token) return <SendEmailSection />;

  const isValidToken = await api.auth.getResetPasswordTokenExpire.query(token);

  // ถ้า Token ไม่ถูกต้อง ให้แสดงหน้า InvalidToken
  if (!isValidToken) return <InvalidToken />;
  // ถ้า Token ถูกต้อง ให้แสดงหน้า ChangePasswordSection
  else return <ChangePasswordSection token={token} />;
}
