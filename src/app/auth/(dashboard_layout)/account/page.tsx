"use client";
import { DashboardMainContainer } from "@/components/layouts/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getNamePrefix } from "@/lib/auth";
import { useSession } from "next-auth/react";

export default function AccountPage() {
  const { data: session } = useSession();
  return (
    <DashboardMainContainer>
      <h1>Manage Account</h1>
      <Separator className="my-5" />
      <div className="flex gap-2">
        <div className="flex-1">
          <h2 className="mb-3">General Infomation</h2>
          <div className="flex gap-5 items-center">
            <Avatar className="w-32 h-32">
              <AvatarImage />
              <AvatarFallback className="text-3xl">
                {getNamePrefix(session?.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <Input placeholder="Email Address" />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="mb-3">Login Options</h2>
          <div className=" grid-cols-[1fr_auto] grid"></div>
        </div>
      </div>
    </DashboardMainContainer>
  );
}
