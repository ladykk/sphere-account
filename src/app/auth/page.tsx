import { getServerAuthSession } from "@/server/modules/auth/server";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    callbackUrl?: string;
  };
};
export default async function AuthRedirectDefault(props: Props) {
  const session = await getServerAuthSession();

  // Redirect to callback url if user is logged in
  if (session?.user) redirect(props.searchParams?.callbackUrl || "/");
  // Redirect to login if user is not logged in
  else
    redirect(
      `/auth/login${
        props.searchParams.callbackUrl
          ? `?callbackUrl=${props.searchParams.callbackUrl}`
          : ""
      }`
    );
}
