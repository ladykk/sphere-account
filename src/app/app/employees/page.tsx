"use client";
import { SearchKeywordInput } from "@/components/filters/search-keyword";
import { DashboardListContainer } from "@/components/layouts/dashboard";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { DashboardPagination } from "@/components/dashboard/pagination";
import { DataTable, DataTableMetadata } from "@/components/ui/data-table";
import Link from "next/link";
import Image from "next/image";

// Assets
import plus from "@/assets/icon/plus.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNamePrefix } from "@/lib/auth";
import { Edit, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmployeesListPage() {
  const searchParams = useSearchParams();
  const query = api.employee.getPaginateEmployees.useQuery({
    page: Number(searchParams.get("page")) || 1,
    itemsPerPage: Number(searchParams.get("itemsPerPage")) || 10,
    keyword: searchParams.get("keyword") || undefined,
  });
  return (
    <DashboardListContainer>
      <div className="flex items-baseline gap-3">
        <h1>Employees</h1>
        {query.isLoading && <Spinner />}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SearchKeywordInput placeholder="Search by Name..." />
        </div>
        <Link href="/app/employees/create" className={buttonVariants({})}>
          <Image src={plus} alt="plus" className="w-3 h-3 mr-2" />
          Create
        </Link>
      </div>
      <DataTable
        columns={[
          {
            accessorKey: "code",
            header: "Code",
          },
          {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => (
              <Avatar className=" w-16 h-16">
                <AvatarImage src={row.original.image ?? ""} />
                <AvatarFallback>
                  {getNamePrefix(row.original.name)}
                </AvatarFallback>
              </Avatar>
            ),
          },
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            id: "contacts",
            header: "Contacts",
            cell: ({ row }) => (
              <div className="space-y-1">
                <p className="flex">
                  <Mail className="w-5 h-5 mr-2" /> {row.original.email ?? "-"}
                </p>
                <p className="flex">
                  <Phone className="w-5 h-5 mr-2" />
                  {row.original.phoneNumber ?? " -"}
                </p>
              </div>
            ),
          },

          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <div className="flex gap-3 items-center">
                <DataTableMetadata {...row.original} />
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" })
                  )}
                  href={`/app/employees/${row.original.id}`}
                >
                  <Edit />
                </Link>
              </div>
            ),
          },
        ]}
        data={query.data?.list}
      />
      <DashboardPagination {...query.data} />
    </DashboardListContainer>
  );
}
