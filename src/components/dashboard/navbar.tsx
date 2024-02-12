// Assets
import logo from "@/assets/image/SphereLogo.png";
import Image from "next/image";
import { Input } from "../ui/input";
import AuthMenu from "../auth/auth-menu";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const MENU_ITEMS = [
  {
    label: "Projects",
    href: "projects",
  },
  {
    label: "Products",
    href: "products",
  },
  {
    label: "Buy",
    href: "buy",
    children: [],
  },
  {
    label: "Customers",
    href: "customers",
  },
  {
    label: "Employees",
    href: "employees",
  },
];

export function DashboardNavbar() {
  return (
    <nav className="bg-background flex flex-col gap-3 px-10 py-3 shadow-md sticky top-0 left-0 right-0 z-30">
      <div className="flex justify-between items-center">
        <div className="w-[300px]">
          <Image src={logo} alt="Sphere Logo" width={281} height={40} />
        </div>
        {/* TODO: Search Systems */}
        <Input
          className="min-w-96 rounded-full"
          placeholder="Search"
          disabled
        />
        <AuthMenu />
      </div>
      <Separator />
      <div className="h-10 flex justify-center items-center">
        {/* TODO: Dropdown Nav Items */}
        {MENU_ITEMS.map((item, index) => (
          <Link
            key={index}
            href={`/app/${item.href}`}
            className={buttonVariants({
              variant: "ghost",
            })}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
