"use client";

import { DashboardFormContainer } from "@/components/layouts/dashboard";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleTRPCFormError } from "@/lib/utils";
import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { Home } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function PtojectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;
  const isCreate = projectId === "create";

  const [isEdit, setIsEdit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const form = useForm<RouterInputs["project"]["createOrUpdateProject"]>({
    disabled: (isCreate ? false : !isEdit) || isDisabled,
  });

  const mutation = api.project.createOrUpdateProject.useMutation({
    onSuccess: (id, variables) => {
      router.replace(`/app/projects/${id}`);
      form.reset(variables);
    },
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
    onMutate: () => setIsDisabled(true),
    onSettled: () => setIsDisabled(false),
  });

  const onSubmit = (
    input: RouterInputs["project"]["createOrUpdateProject"]
  ) => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Saving Project...",
      success: "Project Saved",
      error: "Failed to Save Project",
    });
  };

  return (
    <Form {...form}>
      <DashboardFormContainer onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-baseline gap-3 mb-10">
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
        </div>
        <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-10">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project's Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <p>TODO: Customer Selector</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <div />
          <FormField
            control={form.control}
            name="detail"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Project's Detail</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    className=" h-48"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end items-center gap-5">
          {isCreate ? (
            <Button type="submit" disabled={!form.formState.isDirty}>
              Create
            </Button>
          ) : (
            <>
              {isEdit ? (
                <>
                  <Button type="button" onClick={() => setIsEdit(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!form.formState.isDirty}>
                    Save
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEdit(true)}>
                  Edit
                </Button>
              )}
            </>
          )}
        </div>
      </DashboardFormContainer>
    </Form>
  );
}
