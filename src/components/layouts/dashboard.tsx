import { ClassAttributes, HTMLAttributes, JSX, ReactNode } from "react";
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

type DashboardMainContainerProps = JSX.IntrinsicAttributes &
  ClassAttributes<HTMLDivElement> &
  HTMLAttributes<HTMLDivElement>;
export function DashboardMainContainer(props: DashboardMainContainerProps) {
  return (
    <div
      {...props}
      className={cn(
        "my-5 max-w-screen-2xl bg-background mx-auto w-full p-10 rounded-xl shadow-md",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
