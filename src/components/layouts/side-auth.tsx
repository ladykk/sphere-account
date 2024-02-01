import Image from "next/image";
import { Spinner } from "../ui/spinner";

// Assets
import logo from "@/assets/image/SphereLogo.png";
import sideImg from "@/assets/image/sphere-login.png";

type SideAuthLayoutProps = {
  children: React.ReactNode;
  loading?: boolean;
};
export default function SideAuthLayout(props: SideAuthLayoutProps) {
  return (
    <section className="min-h-screen">
      <div className="flex h-screen">
        <div className="relative hidden flex-1 lg:block">
          <Image
            src={sideImg}
            alt="Picture of the author"
            className="object-cover rounded-r-[40px]"
            sizes="100vh"
            fill
          />
        </div>
        <div className="flex-1 h-fit flex justify-center items-center min-h-screen">
          <div className="p-5 relative lg:max-w-lg mx-auto flex-1">
            {props.loading ? (
              <Spinner className="h-14 w-14 mx-auto" />
            ) : (
              <>
                <Image
                  src={logo}
                  alt="Spheresoft Account"
                  className="mb-10 mx-auto lg:mx-0"
                  width={379}
                  height={56.27}
                />
                {props.children}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
