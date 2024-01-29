import { getServerAuthSession } from "@/server/modules/auth/server";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    callbackUrl?: string;
  };
  children: JSX.Element;
};
export default async function AuthLayout(props: Props) {
  const session = await getServerAuthSession();

  // Redirect to callback url if user is logged in
  if (session?.user) redirect(props.searchParams?.callbackUrl || "/");
  // Redirect to login if user is not logged in
  else return props.children;
}
