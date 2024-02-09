"use client";

import { AvatarInput } from "@/components/auth/avatar-input";
import { DashboardFormContainer } from "@/components/layouts/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Spinner } from "@/components/ui/spinner";
import { getNamePrefix } from "@/lib/auth";
import { fileToPresignedUrlInput, uploadFile } from "@/lib/file";
import { handleTRPCFormError } from "@/lib/utils";
import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { useMutation } from "@tanstack/react-query";
import { Home, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = RouterInputs["employee"]["createOrUpdateEmployee"] & {
  files: {
    image: File | null;
  };
};

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;
  const isCreate = employeeId === "create";

  const [isEdit, setIsEdit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const query = api.employee.getEmployee.useQuery(employeeId, {
    enabled: !isCreate,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const form = useForm<FormInput>({
    disabled: (isCreate ? false : !isEdit) || isDisabled || query.isLoading,
  });
  const presignImageMutation = api.employee.generatePresignUrl.useMutation();
  const createOrUpdateMutation =
    api.employee.createOrUpdateEmployee.useMutation({
      onSuccess: (id, variables) => {
        router.replace(`/app/employees/${id}`);
        form.reset(variables);
      },
      onError: (error) =>
        handleTRPCFormError(error.data?.zodError, form.setError),
    });
  const mutation = useMutation<void, Error, FormInput>({
    mutationFn: async (input) => {
      let { files, ...data } = input;

      // Upload image
      if (files.image) {
        const presignedUrl = await presignImageMutation.mutateAsync([
          fileToPresignedUrlInput(files.image),
        ]);

        data.image = (
          await uploadFile(presignedUrl[0], files.image).catch((err) => {
            form.setError("files.image", {
              type: "manual",
              message: err.message,
            });
            throw err;
          })
        ).url;
      }

      // Create or update employee
      await createOrUpdateMutation.mutateAsync({
        ...data,
        email: data.email && data.email.length > 0 ? data.email : null,
        phoneNumber:
          data.phoneNumber && data.phoneNumber.length > 0
            ? data.phoneNumber
            : null,
      });

      setIsEdit(false);
      setTimeout(() => query.refetch(), 1000);
    },
    onMutate: () => setIsDisabled(true),
    onSettled: () => setIsDisabled(false),
  });

  // Set form data if query is successful
  useEffect(() => {
    if (!query.data) return;
    form.reset({
      id: query.data.id,
      saleNo: query.data.saleNo,
      name: query.data.name,
      email: query.data.email,
      phoneNumber: query.data.phoneNumber,
      image: query.data.image,
    });
  }, [query.data]);

  const onSubmit = (input: FormInput) => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Saving Employee...",
      success: "Employee Saved",
      error: "Failed to Save Employee",
    });
  };

  return (
    <Form {...form}>
      <DashboardFormContainer onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-baseline gap-3 mb-10">
          <h1>{isCreate ? "Create Employee" : "Employee Detail"}</h1>
          {query.isLoading && <Spinner />}
          <Breadcrumb
            items={[
              {
                label: "Employees",
                icon: Home,
              },
              {
                label: "Employees' List",
                href: "/app/employees",
              },
              {
                label: isCreate ? "Create Employee" : `Employee: ${employeeId}`,
              },
            ]}
          />
        </div>
        {query.isLoadingError ? (
          <>
            <X className="text-destructive mx-auto w-24 h-24" />
            <h2 className="text-center text-destructive my-5">
              Employee not found
            </h2>
          </>
        ) : (
          <>
            <div className="flex gap-x-5">
              <FormField
                control={form.control}
                name="files.image"
                render={({ field }) => (
                  <div>
                    <FormControl>
                      <AvatarInput {...field}>
                        {(fileUrl) => (
                          <Avatar className="w-40 h-40 rounded-md border shadow border-input cursor-pointer hover:opacity-70 transition-opacity">
                            <AvatarImage
                              src={fileUrl ?? query.data?.image ?? ""}
                            />
                            <AvatarFallback className="text-3xl rounded-md">
                              {getNamePrefix(query.data?.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </AvatarInput>
                    </FormControl>
                    {!field.value && (
                      <p className="w-full text-center text-xs mt-2 text-muted-foreground">
                        Click to upload
                      </p>
                    )}
                  </div>
                )}
              />
              <div className="grid grid-cols-4 gap-y-3 gap-x-5 mb-10 flex-1">
                <FormField
                  control={form.control}
                  name="saleNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale No.</FormLabel>
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
                    <FormItem className="col-span-3">
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div />
              </div>
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
                        variant="destructive"
                        onClick={() => setIsEdit(false)}
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
          </>
        )}
      </DashboardFormContainer>
    </Form>
  );
}
