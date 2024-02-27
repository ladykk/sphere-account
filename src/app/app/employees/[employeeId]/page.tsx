"use client";
import {
  DashboardFormWrapper,
  DashboardMainContainer,
} from "@/components/layouts/dashboard";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DataTableMetadata } from "@/components/ui/data-table";
import { DialogUpload } from "@/components/ui/file-upload";
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
import { fileToPresignedUrlInput, uploadFile } from "@/lib/file";
import { handleTRPCFormError } from "@/lib/utils";
import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { useMutation } from "@tanstack/react-query";
import { Home, ImageOff, UploadCloud, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = RouterInputs["employee"]["createOrUpdateEmployee"] & {
  files: {
    image: File | null;
  };
};

const defaultValue: DefaultValues<FormInput> = {
  id: undefined,
  code: "",
  name: "",
  email: "",
  phoneNumber: "",
  image: "",
  isActive: true,
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
      onError: (error) =>
        handleTRPCFormError(error.data?.zodError, form.setError),
    });

  const mutation = useMutation<string, Error, FormInput>({
    mutationFn: async (input) => {
      let { files, ...data } = input;
      toast.loading("Preparing...", {
        id: "employee-detail",
        duration: Number.POSITIVE_INFINITY,
      });
      // Upload image
      if (files.image) {
        toast.loading("Uploading image...", {
          id: "employee-detail",
          duration: Number.POSITIVE_INFINITY,
        });
        const presignedUrl = await presignImageMutation.mutateAsync([
          fileToPresignedUrlInput(files.image),
        ]);

        data.image = (
          await uploadFile(presignedUrl[0], files.image, (progress) => {
            toast.loading(`Uploading image... ${progress}%`, {
              id: "employee-detail",
              duration: Number.POSITIVE_INFINITY,
            });
          }).catch((err) => {
            form.setError("files.image", {
              type: "manual",
              message: err.message,
            });
            throw err;
          })
        ).url;
      }

      toast.loading("Saving Employee...", {
        id: "employee-detail",
        duration: Number.POSITIVE_INFINITY,
      });
      // Create or update employee
      return await createOrUpdateMutation.mutateAsync({
        ...data,
        email: data.email && data.email.length > 0 ? data.email : null,
        phoneNumber:
          data.phoneNumber && data.phoneNumber.length > 0
            ? data.phoneNumber
            : null,
      });
    },
    onSuccess: (id, variables) => {
      form.reset(variables);
      setIsEdit(false);
      router.replace(`/app/employees/${id}`);
      setTimeout(() => query.refetch(), 1000);
      toast.success("Employee Saved Successfully", {
        duration: 5000,
        id: "employee-detail",
      });
    },
    onError: (error) =>
      toast.error("Failed to Save Employee", {
        duration: 5000,
        id: "employee-detail",
      }),
    onMutate: () => setIsDisabled(true),
    onSettled: () => setIsDisabled(false),
  });

  // Set form data if query is successful and not in edit mode
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
        email: query.data.email,
        phoneNumber: query.data.phoneNumber,
        image: query.data.image,
        isActive: query.data.isActive,
      });
    }
  }, [query.data, isEdit, isCreate]);

  return (
    <Form {...form}>
      <DashboardFormWrapper
        onSubmit={form.handleSubmit((input) => mutation.mutate(input))}
        className="max-w-screen-2xl"
      >
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-baseline gap-3">
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
                  label: isCreate
                    ? "Create Employee"
                    : query.data
                    ? `${query.data.code}: ${query.data.name}`
                    : `Employee: ${employeeId}`,
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
                  <>
                    {query.data && <DataTableMetadata {...query.data} />}
                    <Button
                      type="button"
                      onClick={() => setIsEdit(true)}
                      disabled={query.isLoading || !query.data}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {query.isLoadingError && !isCreate ? (
          <>
            <X className="text-destructive mx-auto w-24 h-24" />
            <h2 className="text-center text-destructive my-5">
              Employee not found
            </h2>
          </>
        ) : (
          <DashboardMainContainer>
            <div className="flex gap-x-5">
              <FormField
                control={form.control}
                name="files.image"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center h-6">
                      <FormLabel>Image</FormLabel>
                      {field.value && (
                        <Button
                          variant="link"
                          onClick={() => field.onChange(null)}
                          className="text-destructive h-fit p-0"
                          size="sm"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    {!isEdit && !isCreate ? (
                      <div className="w-52 h-52 border border-input rounded-md flex items-center justify-center">
                        {query.data?.image ? (
                          <img
                            src={query.data?.image}
                            alt=""
                            className="w-full h-full rounded-mb object-cover rounded-md"
                          />
                        ) : (
                          <ImageOff className="w-10 h-10" />
                        )}
                      </div>
                    ) : (
                      <DialogUpload
                        {...field}
                        header="Upload Image"
                        accept={{
                          "image/png": [".png"],
                          "image/jpg": [".jpg"],
                          "image/jpeg": [".jpeg"],
                          "image/webp": [".webp"],
                        }}
                      >
                        {(fileUrl) => (
                          <FormControl>
                            <Button
                              variant="outline"
                              className="aspect-square border h-52 flex items-center justify-center flex-col gap-3 p-0"
                              type="button"
                              disabled={form.formState.disabled}
                            >
                              {fileUrl || query.data?.image ? (
                                <img
                                  src={fileUrl ?? query.data?.image ?? ""}
                                  alt=""
                                  className="w-full h-full object-cover rounded-md hover:opacity-80 bg-white transition-opacity"
                                />
                              ) : (
                                <>
                                  <UploadCloud className=" w-10 h-10" />
                                  Upload Image
                                </>
                              )}
                            </Button>
                          </FormControl>
                        )}
                      </DialogUpload>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-4 gap-y-3 gap-x-5 flex-1 h-fit">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. EMP00000001" />
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
                      <FormLabel required>Name</FormLabel>
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
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
                <div />
              </div>
            </div>
          </DashboardMainContainer>
        )}
      </DashboardFormWrapper>
    </Form>
  );
}
