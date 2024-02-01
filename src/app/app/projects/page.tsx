"use client";
import { CheckboxDropdown } from "@/components/filters/dropdown";
import { SearchKeywordInput } from "@/components/filters/search-keyword";
import { DashboardListContainer } from "@/components/layouts/dashboard";
import { Button } from "@/components/ui/button";
import plus from "@/assets/icon/plus.svg";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProjectsListPage() {
  return (
    <DashboardListContainer>
      <h1>Projects</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SearchKeywordInput placeholder="Search by Name..." />
          <CheckboxDropdown
            key="customerId"
            placeholder="Filter by Customer"
            searchPlaceholder="Search Customer..."
            options={[
              {
                id: "1",
                name: "Customer 1",
              },
              {
                id: "2",
                name: "Customer 2",
              },
              {
                id: "3",
                name: "Customer 3",
              },
            ]}
            setLabel={(option) => option.name}
            setValue={(option) => option.id}
            setMultiLabel={(values) => `${values.length} Customers`}
          />
        </div>
        <Button prefixIcon={plus}>Create</Button>
      </div>
      <div>Table</div>
      <div className="flex items-center justify-between">
        <p className="font-medium text-muted-foreground">Page 1 of 8</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>7</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>8</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </DashboardListContainer>
  );
}
