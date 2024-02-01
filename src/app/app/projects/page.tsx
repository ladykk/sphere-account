"use client";
import { CheckboxDropdown } from "@/components/filters/dropdown";
import { SearchKeywordInput } from "@/components/filters/search-keyword";
import { DashboardListContainer } from "@/components/layouts/dashboard";

export default function ProjectsListPage() {
  return (
    <DashboardListContainer>
      <h1>Projects</h1>
      <div className="flex items-center">
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
      </div>
      <div>Table</div>
      <div>Pagination</div>
    </DashboardListContainer>
  );
}
