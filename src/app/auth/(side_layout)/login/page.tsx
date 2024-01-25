import { Input } from "@/components/ui/input";
import Image from "next/image";
import emailIcon from "@/asset/icon/email.svg";
import lockKey from "@/asset/icon/padlock.png";
import facebookLogo from "@/asset/image/facebookLogo.png";
import googleLogo from "@/asset/image/googleLogo.png";
import lineLogo from "@/asset/image/lineLogo.png";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <div className="w-full space-y-6">
      <h1 className="mb-2">Login to your account</h1>
      <h5 className="text-muted-foreground ">Login in with your email</h5>
      <div className="space-y-4">
        <Input
          type="email"
          prefixIcon={emailIcon}
          placeholder="Email Address"
        />
        <Input type="password" prefixIcon={lockKey} placeholder="Password" />
      </div>
      <div className="flex items-center w-full gap-8 px-2">
        <Separator className="flex-1 bg-muted-foreground text-sm" />
        <p>or continue with</p>
        <Separator className="flex-1 bg-muted-foreground" />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="flex-1 gap-2">
          <Image src={googleLogo} alt="Google" className="w-5 h-5" />
          Google
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <Image src={facebookLogo} alt="Facebook" className="w-5 h-5" />
          Facebook
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <Image src={lineLogo} alt="LINE" className="w-5 h-5" />
          Line
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Checkbox />
          <Label className="font-normal">Remember me</Label>
        </div>
        <Link
          href="/auth/reset-password"
          className={cn(buttonVariants({ variant: "link" }), "font-normal")}
        >
          Forget Password?
        </Link>
      </div>
      <Button className="w-full my-8">Login</Button>
      <div className="flex justify-center gap-6 items-center text-sm">
        <div>Don't have an account? </div>
        <Link
          href="/auth/register"
          className={cn(buttonVariants({ variant: "link" }), "font-normal")}
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}