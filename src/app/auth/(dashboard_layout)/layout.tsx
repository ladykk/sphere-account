"use client";
import DashboardLayout from "@/components/layouts/dashboard";
import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

export default function Layout(props: Props) {
  useSession({
    required: true,
  });
  return <DashboardLayout>{props.children}</DashboardLayout>;
}
