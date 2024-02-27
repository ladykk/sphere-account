"use client";
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
import { Edit, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";

export default function CustomersListPage() {
  const searchParams = useSearchParams();
  const query = api.customer.getPaginateCustomers.useQuery({
    page: Number(searchParams.get("page")) || 1,
    itemsPerPage: Number(searchParams.get("itemsPerPage")) || 10,
    customerId: searchParams.get("customerId") || undefined,
  });

  return (
    <DashboardListContainer>
      <div className="flex items-baseline gap-3">
        <h1>Customers</h1>
        {query.isLoading && <Spinner />}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SearchKeywordInput placeholder="Search by Name..." />
        </div>
        <Link href="/app/customers/create" className={buttonVariants({})}>
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
            accessorKey: "taxId",
            header: "Tax ID",
          },
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            accessorKey: "address",
            header: "Address",
          },

          {
            id: "contacts",
            header: "Contacts",
            cell: ({ row }) => (
              <Accordion type="single" collapsible>
                {row.original.contacts
                  .filter((contact) => contact.isActive) // Show only active contacts
                  .sort(
                    (
                      a,
                      b // Sort by createdAt ASC
                    ) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .slice(0, 3) // Show only 3 contacts
                  .map((contact, index) => (
                    <AccordionItem key={contact.id} value={contact.id}>
                      <AccordionTrigger className="text-sm py-2">
                        {index + 1}. {contact.contactName}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1">
                          {contact.email?.split(",").map((email) => (
                            <p key={email} className="flex items-center ml-5">
                              <Mail className="w-5 h-5 mr-2" />
                              {email}
                            </p>
                          ))}
                          {contact.phoneNumber?.split(",").map((phone) => (
                            <p key={phone} className="flex items-center ml-5">
                              <Phone className="w-5 h-5 mr-2" />
                              {phone}
                            </p>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
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
                  href={`/app/customers/${row.original.id}`}
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
