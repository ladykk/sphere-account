import imgLogin from "@/asset/image/sphere-login.png";
import Image from "next/image";
import SphereLogo from "@/asset/image/SphereLogo.png";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
      <div className="flex h-full h-screen">
        <div className="w-[50%] relative">
          <Image
            src={imgLogin}
            alt="Picture of the author"
            // layout="responsive"
            style={{
              objectFit: "cover",
              borderRadius: "0px 40px 40px 0px",
            }}
            sizes="100vh"
            fill
          />
        </div>

        <div className="w-[50%] flex items-center justify-center flex-col">
          <div>
            <Image
              src={SphereLogo}
              alt="Spheresoft Account"
              width={379}
              height={56.2}
            />
          </div>
          <div className="mt-[40px] max-w-[479px]">{children}</div>
          
        </div>
      </div>
    </section>
  );
}
