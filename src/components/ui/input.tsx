"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import eyeOff from "@/asset/icon/eyeoff.svg";
import eyeOn from "@/asset/icon/eyeon.svg";
import Image from "next/image";
import { VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      inputSize: {
        default: "px-3 py-2 h-10 text-sm",
        xl: "h-16 px-4 py-3",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  prefixIcon?: any;
  subfixIcon?: any;
  classNames?: {
    container?: string;
    prefixIcon?: string;
    subfixIcon?: string;
  };
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      prefixIcon,
      subfixIcon,
      classNames,
      inputSize,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(true);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
      <div className={cn("relative", classNames?.container)}>
        <input
          type={
            type === "password" ? (showPassword ? "password" : "text") : type
          }
          className={cn(
            inputVariants({
              inputSize,
              className: cn(
                prefixIcon && (inputSize === "xl" ? "pl-[60px]" : "pl-10"),
                subfixIcon && (inputSize === "xl" ? "pr-[60px]" : "pr-10"),
                className
              ),
            })
          )}
          ref={ref}
          {...props}
        />
        {prefixIcon && (
          <div
            className={cn(
              "absolute top-0 bottom-0 flex items-center",
              inputSize === "xl" ? "left-4" : "left-3"
            )}
          >
            <Image
              src={prefixIcon}
              className={cn(
                inputSize === "xl" ? "w-[30px] h-[30px]" : "w-5 h-5",
                classNames?.prefixIcon
              )}
              alt="prefix-icon"
            />
          </div>
        )}
        {(type === "password" || subfixIcon) && (
          <div
            className={cn(
              "absolute top-0 bottom-0 flex items-center",
              inputSize === "xl" ? "right-4" : "right-3",
              type === "password" && "cursor-pointer"
            )}
            onClick={type === "password" ? togglePasswordVisibility : undefined}
          >
            {type === "password" ? (
              showPassword ? (
                <Image
                  src={eyeOff}
                  className={cn(
                    inputSize === "xl" ? "w-[30px] h-[30px]" : "w-5 h-5",
                    classNames?.subfixIcon
                  )}
                  alt="hide-password"
                />
              ) : (
                <Image
                  src={eyeOn}
                  className={cn(
                    inputSize === "xl" ? "w-[30px] h-[30px]" : "w-5 h-5",
                    classNames?.subfixIcon
                  )}
                  alt="show-password"
                />
              )
            ) : (
              <Image
                src={subfixIcon}
                className={cn(
                  inputSize === "xl" ? "w-[30px] h-[30px]" : "w-5 h-5",
                  classNames?.subfixIcon
                )}
                alt="subfix-icon"
              />
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
