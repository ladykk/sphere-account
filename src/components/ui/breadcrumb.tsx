import { cn } from "@/lib/utils";
import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";

type BreadcrumbProps = {
  items: Array<{
    label: string;
    href?: string;
    icon?: LucideIcon;
  }>;
};

export const Breadcrumb = (props: BreadcrumbProps) => {
  return (
    <div className="flex items-center text-sm">
      {props.items.map((item, index) => (
        <Link
          key={index}
          href={item.href ?? "#"}
          className={cn(
            "flex items-center transition-all",
            !item.href
              ? "text-muted-foreground cursor-not-allowed"
              : "hover:underline underline-offset-1"
          )}
        >
          {item.icon && <item.icon className="w-4 h-4 mr-1.5" />}
          {item.label}
          {index !== props.items.length - 1 && (
            <ChevronRight className="w-4 h-4 mx-1.5" />
          )}
        </Link>
      ))}
    </div>
  );
};
