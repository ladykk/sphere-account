"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import Eyeoff from "@/asset/icon/eyeoff.svg";
import Eyeon from "@/asset/icon/eyeon.svg";
import Image from "next/image";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixIcon?: any;
  prefixIconClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefixIcon,prefixIconClass, ...props }, ref) => {

    const [showPassword, setShowPassword] = React.useState(true);
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };


    return (
      <div className="relative">
        {" "}
        <input
          type={type}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {prefixIcon && (
          <div className="absolute  flex items-center top-[0px] h-full left-[15px]"> <Image src={prefixIcon} className={prefixIconClass} alt="icon" /></div>
         
        ) 
        }
        {type === "password" && (
          <div
            className="absolute inset-y-0 right-[4%] flex items-center pr-2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <Image src={Eyeoff} alt="Eye Off" />
            ) : (
              <div>
                <Image src={Eyeon} alt="Eye On" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
