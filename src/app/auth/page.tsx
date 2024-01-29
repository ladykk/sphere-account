import { getServerAuthSession } from "@/server/modules/auth/server";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    callbackUrl?: string;
  };
};
export default async function AuthRedirectDefault(props: Props) {
  redirect(
    `/auth/login${
      props.searchParams.callbackUrl
        ? `?callbackUrl=${props.searchParams.callbackUrl}`
        : ""
    }`
  );
}
