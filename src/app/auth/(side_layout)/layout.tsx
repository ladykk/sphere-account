"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import SideAuthLayout from "@/components/layouts/side-auth";
import { useIsMounted } from "usehooks-ts";

type Props = {
  children: React.ReactNode;
};

export default function Layout(props: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { data: session, status } = useSession();
  const isMounted = useIsMounted();

  // If session exists, redirect to callbackUrl
  // useEffect(() => {
  //   if (session?.user) router.replace(callbackUrl);
  // }, [session]);

  return (
    <SideAuthLayout loading={!isMounted || status === "loading"}>
      {props.children}
    </SideAuthLayout>
  );
}
