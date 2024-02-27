import { ReactNode, useMemo } from "react";
import {
  FileUploadDropzone,
  SingleFileUploadDropzoneBaseProps,
} from "../ui/file-upload";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import lineLogo from "@/assets/image/lineLogo.png";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { getNamePrefix } from "@/lib/auth";
import Link from "next/link";

export const AvatarMenu = () => {
  const { data: session, status } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className=" cursor-pointer">
          <AvatarImage src={session?.user.image ?? ""} />
          <AvatarFallback> {getNamePrefix(session?.user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={15}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/auth/account">
          <DropdownMenuItem>Manage Account</DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Language</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Thai</DropdownMenuItem>
              <DropdownMenuItem>Engilsh</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            onClick={() =>
              toast.promise(signOut, {
                loading: "Loging out...",
              })
            }
            variant="ghost"
            className="p-3 pl-0 h-4"
          >
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
