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
import Barcode from "react-barcode";

// Assets
import plus from "@/assets/icon/plus.svg";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductsListPage() {
  const searchParams = useSearchParams();
  const query = api.product.getPaginateProduct.useQuery({
    page: Number(searchParams.get("page")) || 1,
    itemsPerPage: Number(searchParams.get("itemsPerPage")) || 10,
    keyword: searchParams.get("keyword") || undefined,
    category: searchParams.get("category") || undefined,
    type: searchParams.get("type") || undefined,
  });

  const categoryQuery = api.product.getCatagories.useQuery();

  return (
    <DashboardListContainer>
      <div className="flex items-baseline gap-3">
        <h1>Products</h1>
        {query.isLoading && <Spinner />}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SearchKeywordInput placeholder="Search by Name, Code, Barcode..." />
          <CheckboxDropdown
            searchKey="category"
            placeholder="Filter by Category"
            options={categoryQuery.data}
            setLabel={(option) => option}
            setValue={(option) => option}
            loading={categoryQuery.isLoading}
            setMultiLabel={(values) => `${values.length} Categories`}
          />
          <CheckboxDropdown
            searchKey="type"
            placeholder="Filter by Type"
            options={[
              {
                label: "Stock",
                value: "stock",
              },
              {
                label: "Service",
                value: "service",
              },
            ]}
            setLabel={(option) => option.label}
            setValue={(option) => option.value}
            setMultiLabel={(values) => `${values.length} Types`}
          />
        </div>
        <Link href="/app/products/create" className={buttonVariants({})}>
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
            accessorKey: "barcode",
            header: "Barcode",
            cell: ({ row }) =>
              row.original.barcode ? (
                <Barcode
                  value={row.original.barcode}
                  width={1.5}
                  height={30}
                  fontSize={14}
                />
              ) : (
                "Not Registerd"
              ),
          },
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            accessorKey: "category",
            header: "Category",
          },
          {
            accessorKey: "sellingPrice",
            header: "Selling Price",
            cell: ({ row }) => (
              <div>
                <p className="font-semibold">
                  {row.original.sellingPrice.toFixed(2) + " Baht"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {row.original.vatType?.toUpperCase()} VAT
                </p>
              </div>
            ),
          },
          {
            id: "stock",
            header: "Stock",
            cell: ({ row }) => (
              <div>
                {row.original.type === "stock" ? (
                  <>
                    <p className="font-semibold">{row.original.stock}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.original.unit}(s)
                    </p>
                  </>
                ) : (
                  <p>Service</p>
                )}
              </div>
            ),
          },
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <div className="space-x-3">
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" })
                  )}
                  href={`/app/products/${row.original.id}`}
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
