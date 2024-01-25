import imgLogin from "@/asset/image/sphere-login.png";
import Image from "next/image";
import SphereLogo from "@/asset/image/SphereLogo.png";

type Props = {
  children: React.ReactNode;
};

export default function LoginLayout(props: Props) {
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
          <Image
            src={SphereLogo}
            alt="Spheresoft Account"
            className="mb-10"
            width={379}
            height={56.27}
          />
          {props.children}
        </div>
      </div>
    </section>
  );
}
