"use client";

import { DashboardFormContainer } from "@/components/layouts/dashboard";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { useParams } from "next/navigation";

export default function PtojectDetailPage() {
  const params = useParams();
  const projectId = params.projectId;
  const isCreate = projectId === "create";
  return (
    <DashboardFormContainer>
      <div className="flex items-baseline gap-3">
        <h1>{isCreate ? "Create Project" : "Project Detail"}</h1>
        <Breadcrumb
          items={[
            {
              label: "Projects",
              icon: Home,
            },
            {
              label: "Projects' List",
              href: "/app/projects",
            },
            {
              label: isCreate ? "Create Project" : "Detail",
            },
          ]}
        />
        <div className="grid grid-cols-3 gap-3"></div>
      </div>
    </DashboardFormContainer>
  );
}
