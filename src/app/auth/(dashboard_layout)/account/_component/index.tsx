"use client";
import { DashboardMainContainer } from "@/components/layouts/dashboard";
import { Separator } from "@/components/ui/separator";
import { UpdateAccountForm } from "./profile";

export default function AccountClient() {
  return (
    <DashboardMainContainer>
      <h1>Manage Account</h1>
      <Separator className="my-5" />
      <div className="flex gap-10">
        <UpdateAccountForm />

        <div className="flex-1">
          <h3 className="mb-3">Login Options</h3>
          <div className=" grid-cols-[1fr_auto] grid"></div>
        </div>
      </div>
    </DashboardMainContainer>
  );
}
