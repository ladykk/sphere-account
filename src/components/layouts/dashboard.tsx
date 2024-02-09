import {
  ClassAttributes,
  FormHTMLAttributes,
  HTMLAttributes,
  JSX,
  ReactNode,
} from "react";
import { DashboardNavbar } from "../dashboard/navbar";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  children: ReactNode;
};
export default function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <section className="min-h-screen relative h-fit bg-muted flex flex-col">
      <DashboardNavbar />
      <main className="flex-1 flex flex-col">{props.children}</main>
    </section>
  );
}

const mainContainerClassName =
  "my-5 max-w-screen-2xl bg-background mx-auto w-full p-10 rounded-xl shadow-md";

type DashboardMainContainerProps = JSX.IntrinsicAttributes &
  ClassAttributes<HTMLDivElement> &
  HTMLAttributes<HTMLDivElement>;
export function DashboardMainContainer(props: DashboardMainContainerProps) {
  return (
    <div {...props} className={cn(mainContainerClassName, props.className)}>
      {props.children}
    </div>
  );
}

export function DashboardFormContainer(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLFormElement> &
    FormHTMLAttributes<HTMLFormElement>
) {
  return (
    <form {...props} className={cn(mainContainerClassName, props.className)}>
      {props.children}
    </form>
  );
}

export function DashboardListContainer(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLDivElement> &
    HTMLAttributes<HTMLDivElement>
) {
  return (
    <div
      {...props}
      className={cn(
        "px-5 py-10 max-w-screen-3xl mx-auto w-full space-y-6",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export function DashboardFormWrapper(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLFormElement> &
    FormHTMLAttributes<HTMLFormElement>
) {
  return (
    <form
      {...props}
      className={cn(
        "px-5 py-10 max-w-screen-3xl mx-auto w-full space-y-6",
        props.className
      )}
    >
      {props.children}
    </form>
  );
}
