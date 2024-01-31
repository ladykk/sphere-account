import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Image from "next/image";

// Assets
import facebook from "@/assets/image/facebookLogo.png";
import google from "@/assets/image/googleLogo.png";
import line from "@/assets/image/lineLogo.png";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

function LoginProvider({
  provider,
  label,
  registered,
  icon,
}: {
  provider: string;
  label: string;
  registered: boolean | undefined;
  icon: any;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Image src={icon} alt={provider} width={20} height={20} />
        <h5 className="font-medium">{label}</h5>
      </div>
      <Button
        size="sm"
        variant={registered ? "outline" : "secondary"}
        onClick={() => {
          if (registered) return;
          toast.loading("Redirecting to login provider...", {
            duration: 60 * 1000,
          });
          signIn(provider);
        }}
        className=" w-24"
      >
        {registered ? "Registered" : "Register"}
      </Button>
    </div>
  );
}

export function LoginOptions() {
  const query = api.auth.getAccountLoginOptions.useQuery();
  return (
    <div className="flex-1">
      <div className="flex items-center mb-3">
        <h3>Login Options</h3>
        {query.isLoading && <Spinner className="ml-2" />}
      </div>

      {!query.isLoading && (
        <div className="space-y-3">
          <LoginProvider
            provider="facebook"
            label="Facebook"
            registered={query.data?.facebook}
            icon={facebook}
          />
          <LoginProvider
            provider="google"
            label="Google"
            registered={query.data?.google}
            icon={google}
          />
          <LoginProvider
            provider="line"
            label="LINE"
            registered={query.data?.line}
            icon={line}
          />
        </div>
      )}
    </div>
  );
}
