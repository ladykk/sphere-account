import { Input } from "@/components/ui/input";
import emailIcon from "@/asset/icon/email.svg";
import lockKey from "@/asset/icon/padlock.png";

export default function Page() {
  return (
    <div>
      <div className="text-[30px] font-semibold"> Log in to your account</div>
      <div className="mt-[30px] text-[18px] font-normal text-[#4B4B4B]">
        <span>Log in width your email:</span>
      </div>
      <div id="input-wrap" className="mt-[24px]">
        <div>
          <Input
            type="email"
            prefixIcon={emailIcon}
            prefixIconClass=""
            className="h-[60px] pl-[60px]"
          />
          <Input
            type="password"
            prefixIcon={lockKey}
            prefixIconClass="w-[37px] h-[37px]"
            className="h-[60px] pl-[60px] mt-[24px] min-w-[479px]"
          />
        </div>
      </div>
      <div className="mt-[24px] flex justify-center items-center">
        <div className="w-[100px] h-1px "></div>{" "}
      </div>
    </div>
  );
}
