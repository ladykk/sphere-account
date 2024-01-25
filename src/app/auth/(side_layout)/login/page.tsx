import { Input } from "@/components/ui/input";
import Image from "next/image";
import emailIcon from "@/asset/icon/email.svg";
import lockKey from "@/asset/icon/padlock.png";
import facebookLogo from "@/asset/image/facebookLogo.png";
import googleLogo from "@/asset/image/googleLogo.png";
import lineLogo from "@/asset/image/lineLogo.png";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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
        <div className="w-[100px] h-[1px] border-t border-[#4B4B4B]"></div>
        <div className="ml-[45px] mr-[45px]">
          <span className="text-[18px]"> or continue with</span>
        </div>
        <div className="w-[100px] h-[1px] border-t border-[#4B4B4B]"></div>
      </div>
      <div className="mt-[24px] flex justify-center items-center gap-[14px]">
        <div className=" flex justify-center items-center h-[58px] border border-[#AEAEAE] w-[33%] rounded-md gap-[8px]">
          <Image src={googleLogo} alt="google" />
          <span>Google</span>{" "}
        </div>
        <div className=" flex justify-center items-center h-[58px] border border-[#AEAEAE] w-[33%] rounded-md gap-[8px]">
          <Image src={facebookLogo} alt="facebook" />
          <span>Facebook</span>
        </div>
        <div className=" flex justify-center items-center h-[58px] border border-[#AEAEAE] w-[33%] rounded-md gap-[8px]">
          <Image src={lineLogo} alt="Line" />
          <span>Line</span>
        </div>
      </div>
      <div className="mt-[24px] flex justify-between items-center">
        <div className="flex gap-[14px] items-center">
          <Checkbox />
          <div>Remember me</div>{" "}
        </div>
        <div className="text-[#2079CB]">Forgot Password?</div>{" "}
      </div>
      <div className="mt-[40px] mb-[40px]">
        <Button className="w-full h-[60px] bg-[#F17121]">Login</Button>
      </div>
      <div className="flex justify-center gap-[24px] items-center">
        <div>Don’t have an account? </div>
        <div className="text-[#2079CB]"> Create an account</div>
      </div>
    </div>
  );
}
