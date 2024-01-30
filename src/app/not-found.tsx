"use client";

import { usePathname, useRouter } from "next/navigation";
import logo from "@/assets/image/SphereLogo.png";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Notfound() {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <div className="w-screen h-screen text-center relative flex justify-center items-center tall:flex-col p-5 gap-5 sm: pt-[100px]">
      <Image
        src={logo}
        alt="logo"
        width={379}
        height={56.27}
        className="absolute left-0 right-0 mx-auto top-[5%] lg:mx-0 lg:left-[5%] object-contain px-5"
      />
      <div className="sm:flex-[1.5] tall:flex-none md:mb-8">
        <p className="text-primary font-semibold text-[25vw] leading-none mb-5 sm:text-[8vw] lg:text-8xl xl:text-[200px]">
          Error 404
        </p>
        <h1 className="mb-3">Page Not Found</h1>
        <h4 className="mb-2">The page that you're looking for not exists.</h4>
        <h5>({pathName})</h5>
      </div>

      <div className="space-y-4 max-w-xs w-full sm:flex-1 tall:flex-none">
        <Button className="w-full" onClick={() => router.back()}>
          Go Back
        </Button>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
