"use client";
import imgLogin from "@/asset/image/sphere-login.png";
import Image from "next/image";
import SphereLogo from "@/asset/image/SphereLogo.png";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  children: React.ReactNode;
};

export default function AuthSideLayout(props: Props) {
  const [isLoaded, setLoaded] = useState(false);

  // Wait until client is ready
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="min-h-screen">
      <div className="flex h-screen">
        <div className="w-[50%] relative">
          <Image
            src={imgLogin}
            alt="Picture of the author"
            className="object-cover rounded-r-[40px]"
            sizes="100vh"
            fill
          />
        </div>
        <div className="w-[50%] flex justify-center flex-col max-w-md mx-auto">
          {!isLoaded ? (
            <Spinner className="h-14 w-14 mx-auto" />
          ) : (
            <>
              <Image
                src={SphereLogo}
                alt="Spheresoft Account"
                className="mb-10"
                width={379}
                height={56.27}
              />
              {props.children}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
