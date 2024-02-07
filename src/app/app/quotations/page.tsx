"use client";
import { CheckboxDropdown } from "@/components/filters/dropdown";
import { SearchKeywordInput } from "@/components/filters/search-keyword";
import { DashboardListContainer } from "@/components/layouts/dashboard";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { DashboardPagination } from "@/components/dashboard/pagination";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import Image from "next/image";

// Assets
import plus from "@/assets/icon/plus.svg";

export default function ProjectsListPage() {
  const searchParams = useSearchParams();
  const query = api.project.getPaginateProjects.useQuery({
    page: Number(searchParams.get("page")) || 1,
    itemsPerPage: Number(searchParams.get("itemsPerPage")) || 10,
    customerId: searchParams.get("customerId") || undefined,
  });
  return (
    <DashboardListContainer>
      <div className="flex items-baseline gap-3">
        <h1>Projects</h1>
        {query.isLoading && <Spinner />}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SearchKeywordInput placeholder="Search by Name..." />
          <CheckboxDropdown
            searchKey="customerId"
            placeholder="Filter by Customer"
            searchPlaceholder="Search Customer..."
            options={[]} // TODO: Set Options
            setLabel={(option) => "TODO: Set Label"}
            setValue={(option) => "TODO: Set Value"}
            setMultiLabel={(values) => `${values.length} Customers`}
          />
        </div>
        <Link href="/app/quotations/create" className={buttonVariants({})}>
          <Image src={plus} alt="plus" className="w-3 h-3 mr-2" />
          Create
        </Link>
      </div>
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            accessorKey: "customerId",
            header: "Customer",
            cell: ({ row }) => "TODO: Customer Display",
          },
          {
            accessorKey: "detail",
            header: "Detail",
          },
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => "TODO: Action Buttons",
          },
        ]}
        data={query.data?.list}
      />
      <DashboardPagination {...query.data} />
    </DashboardListContainer>
  );
}
