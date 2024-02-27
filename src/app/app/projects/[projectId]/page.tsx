"use client";

import {
  DashboardFormContainer,
  DashboardFormWrapper,
  DashboardMainContainer,
} from "@/components/layouts/dashboard";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { handleTRPCFormError } from "@/lib/utils";
import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { Home, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = RouterInputs["project"]["createOrUpdateProject"];
const defaultValue: DefaultValues<FormInput> = {
  id: undefined,
  code: "",
  name: "",
  customerId: "",
  detail: "",
  isActive: true,
};

export default function PtojectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const isCreate = projectId === "create";

  const [isEdit, setIsEdit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const query = api.project.getProject.useQuery(projectId, {
    enabled: !isCreate,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const customer = api.customer.getCustomerDropdown.useQuery();

  const form = useForm<RouterInputs["project"]["createOrUpdateProject"]>({
    disabled: (isCreate ? false : !isEdit) || isDisabled || query.isLoading,
  });

  const mutation = api.project.createOrUpdateProject.useMutation({
    onSuccess: (id, variables) => {
      form.reset(variables);
      setIsEdit(false);
      router.replace(`/app/projects/${id}`);
      setTimeout(() => query.refetch(), 1000);
    },
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
    onMutate: () => setIsDisabled(true),
    onSettled: () => setIsDisabled(false),
  });

  // Set form data if query is successful
  useEffect(() => {
    if (isCreate) {
      form.reset(defaultValue);
    } else {
      if (!query.data) return;
      if (isEdit) return;
      form.reset({
        id: query.data.id,
        code: query.data.code,
        name: query.data.name,
        customerId: query.data.customerId,
        detail: query.data.detail,
        isActive: query.data.isActive,
      });
    }
  }, [query.data, isEdit, isCreate]);

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
      <DashboardFormWrapper
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-screen-2xl"
      >
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-baseline gap-3">
            <h1>{isCreate ? "Create Project" : "Project Detail"}</h1>
            {query.isLoading && <Spinner />}
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
                  label: isCreate
                    ? "Create Project"
                    : query.data
                    ? `${query.data.code}: ${query.data.name}`
                    : `Project: ${projectId}`,
                },
              ]}
            />
          </div>
          <div className="flex justify-end items-center gap-3">
            {isCreate ? (
              <Button type="submit" disabled={!form.formState.isDirty}>
                Create
              </Button>
            ) : (
              <>
                {isEdit ? (
                  <>
                    <Button
                      type="button"
                      onClick={() => setIsEdit(false)}
                      variant="destructive"
                    >
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
        </div>

        {query.isLoadingError && !isCreate ? (
          <>
            <X className="text-destructive mx-auto w-24 h-24" />
            <h2 className="text-center text-destructive my-5">
              Project not found
            </h2>
          </>
        ) : (
          <DashboardMainContainer>
            <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-10">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                    <FormControl>
                      <ComboBox
                        options={customer.data}
                        setLabel={(option) => option.name}
                        setValue={(option) => option.id}
                        value={field.value}
                        onChange={field.onChange}
                        multiple={false}
                        disabled={field.disabled}
                        loading={customer.isLoading}
                        placeholder="Select Customer"
                        searchPlaceholder="Search Customer"
                        searchNoResultText="No Customer Found"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detail"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Detail</FormLabel>
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
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Is Active</FormLabel>
                    <div className="h-10 flex items-center">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={field.disabled}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </DashboardMainContainer>
        )}
      </DashboardFormWrapper>
    </Form>
  );
}
