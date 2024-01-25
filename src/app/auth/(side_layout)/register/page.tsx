import { Input } from "@/components/ui/input";
import emailIcon from "@/asset/icon/email.svg";
import lockKey from "@/asset/icon/padlock.png";
import { Separator } from "@/components/ui/separator";
import facebookLogo from "@/asset/image/facebookLogo.png";
import googleLogo from "@/asset/image/googleLogo.png";
import lineLogo from "@/asset/image/lineLogo.png";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function page() {
  return (
    <div className="w-full">
      <h1 className="mb-6">Register </h1>
      <h4 className=" text-muted-foreground">
        Enter your information below to create your account
      </h4>
      <div className="space-y-4 mt-3">
        <div className="flex gap-2 items-center">
          <Input placeholder="First Name" />
          <Input placeholder="Last Name" />
        </div>
        <Input placeholder="Email" prefixIcon={emailIcon} />
        <Input type="password" placeholder="Password" prefixIcon={lockKey} />
        <Input
          type="password"
          placeholder="Confirm Password"
          prefixIcon={lockKey}
        />
        <div className="flex items-center w-full gap-11 px-2">
          <Separator className="flex-1 bg-muted-foreground" />
          <h4>or continue with</h4>
          <Separator className="flex-1 bg-muted-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <Button size="xl" variant="outline" className="flex-1 gap-2">
            <Image src={googleLogo} alt="Google" className="w-5 h-5" />
            Google
          </Button>
          <Button size="xl" variant="outline" className="flex-1 gap-2">
            <Image src={facebookLogo} alt="Facebook" className="w-5 h-5" />
            Facebook
          </Button>
          <Button size="xl" variant="outline" className="flex-1 gap-2">
            <Image src={lineLogo} alt="LINE" className="w-5 h-5" />
            Line
          </Button>
              </div>
              
          </div>
          <Button className="w-full my-9" size="xl">
        Register
          </Button>
          <div className="flex justify-center gap-6 items-center">
              <div> Already have an account?</div>
              <Link
                  href="/auth/login"
                  className={cn(
            buttonVariants({ variant: "link" }),
            "text-base font-normal"
          )}>Login</Link>
          </div>
    </div>
  );
}
