"use client";
import { DashboardMainContainer } from "@/components/layouts/dashboard";
import { Separator } from "@/components/ui/separator";
import { UpdateAccountForm } from "./_component/update-account-form";
import { LoginOptions } from "./_component/login-options";

export default function AccountClient() {
  return (
    <DashboardMainContainer className="max-w-6xl">
      <h1>Manage Account</h1>
      <Separator className="my-5" />
      <div className="flex gap-10">
        <UpdateAccountForm />
        <LoginOptions />
      </div>
    </DashboardMainContainer>
  );
}
