"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns?: ColumnDef<TData, TValue>[];
  data?: TData[];
  className?: string;
}

export function DataTable<TData, TValue>({
  columns = [],
  data = [],
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("rounded-md border bg-background", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="first:rounded-tl-md last:rounded-tr-md"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

type DataTablePaginationProps = {
  count: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onChangeItemsPerPage: (itemsPerPage: number) => void;
  className?: string;
};
export function DataTablePagination(props: DataTablePaginationProps) {
  return (
    <div className={cn("flex justify-between", props.className)}>
      <div className="hidden sm:flex gap-3 items-center">
        <p className="text-sm font-medium text-muted-foreground">
          Showing {props.currentPage} to{" "}
          {props.currentPage * props.itemsPerPage > props.count
            ? props.count
            : props.currentPage * props.itemsPerPage}{" "}
          of {props.count} entries
        </p>
      </div>
      <div className="flex-1 hidden sm:block" />
      <div className="gap-2 flex items-center mr-3">
        <p className="text-sm ">Items per page</p>
        <Select
          value={props.itemsPerPage.toString()}
          onValueChange={(value) => props.onChangeItemsPerPage(Number(value))}
        >
          <SelectTrigger className="w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((itemsPerPage) => (
              <SelectItem key={itemsPerPage} value={itemsPerPage.toString()}>
                {itemsPerPage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="gap-3 flex items-center">
        <Button
          variant="outline"
          size="icon"
          onChange={() => props.onChangePage(props.currentPage - 1)}
          disabled={props.currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="sr-only">Previous</span>
        </Button>
        <p className="text-sm">
          {props.currentPage} of {props.totalPages}
        </p>
        <Button
          variant="outline"
          size="icon"
          onChange={() => props.onChangePage(props.currentPage + 1)}
          disabled={props.currentPage === props.totalPages}
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
