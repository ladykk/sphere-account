"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "@/hooks/search-params";
import { link } from "fs";
import { useMemo } from "react";

type DashboardPaginationProps = {
  count?: number;
  totalPage?: number;
  currentPage?: number;
  maxPage?: number;
};
export const DashboardPagination = (props: DashboardPaginationProps) => {
  const count = props.count || 0;
  const totalPage = props.totalPage || 1;
  const currentPage = props.currentPage || 1;
  const maxPage = 3;

  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const links = useMemo(() => {
    const links: Array<{
      type: "page" | "ellipsis" | "previous" | "next";
      value: number;
    }> = [];

    // If totalPage less than or equal maxPage + 2, render all links
    if (totalPage <= maxPage + 2) {
      links.push({
        type: "previous",
        value: Math.max(1, currentPage - 1),
      });
      for (let i = 1; i <= totalPage; i++) {
        links.push({
          type: "page",
          value: i,
        });
      }
      links.push({
        type: "next",
        value: Math.min(totalPage, currentPage + 1),
      });
      return links;
    }

    const halfMaxPage = Math.floor(maxPage / 2);

    // Start render link from 2
    const startRenderLink = Math.max(2, currentPage - halfMaxPage);
    // End render link from totalPage - 1
    const endRenderLink = Math.min(
      totalPage - 1,
      startRenderLink + maxPage - 1
    );

    const isRenderLeftEllipsis =
      startRenderLink > 2 && currentPage > halfMaxPage + 1;

    const isRenderRightEllipsis =
      endRenderLink < totalPage && currentPage < totalPage - halfMaxPage - 1;

    links.push({
      type: "previous",
      value: Math.max(1, currentPage - 1),
    });

    // Always render first page
    links.push({
      type: "page",
      value: 1,
    });

    // Render left ellipsis
    if (isRenderLeftEllipsis)
      links.push({
        type: "ellipsis",
        value: 0,
      });

    // Render links
    for (
      let i = Math.min(startRenderLink, totalPage - maxPage);
      i <= endRenderLink;
      i++
    ) {
      links.push({
        type: "page",
        value: i,
      });
    }

    if (endRenderLink < totalPage) {
      if (currentPage < totalPage - Math.floor(maxPage / 2) - 1)
        links.push({
          type: "ellipsis",
          value: 0,
        });

      links.push({
        type: "page",
        value: totalPage,
      });
    }

    links.push({
      type: "next",
      value: Math.min(totalPage, currentPage + 1),
    });

    return links;
  }, [totalPage, currentPage, maxPage]);
  return (
    <div className="flex items-center justify-between gap-5">
      <p className="font-medium text-muted-foreground">
        Page {currentPage} of {totalPage}
      </p>
      <Pagination className="mr-auto">
        <PaginationContent>
          {links.map((link, index) => (
            <PaginationItem
              key={index}
              onClick={() => {
                // If link is current page, do nothing
                if (link.value === page) return;
                searchParams.set("page", link.value.toString());
              }}
              className="cursor-pointer"
            >
              {link.type === "page" && (
                <PaginationLink isActive={link.value === currentPage}>
                  {link.value}
                </PaginationLink>
              )}
              {link.type === "ellipsis" && <PaginationEllipsis />}
              {link.type === "previous" && <PaginationPrevious />}
              {link.type === "next" && <PaginationNext />}
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
      <p>
        Total {count} {count === 1 ? "item" : "items"}
      </p>
    </div>
  );
};
