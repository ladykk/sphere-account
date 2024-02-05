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
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { handleTRPCFormError } from "@/lib/utils";
import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { Home, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function PtojectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  const isCreate = productId === "create";

  const [isEdit, setIsEdit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // TODO: Change API Endpoint
  const query = api.project.getProject.useQuery(productId, {
    enabled: !isCreate,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const form = useForm<RouterInputs["project"]["createOrUpdateProject"]>({
    disabled: (isCreate ? false : !isEdit) || isDisabled || query.isLoading,
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

  // Set form data if query is successful
  useEffect(() => {
    if (!query.data) return;
    form.reset({
      id: query.data.id,
      name: query.data.name,
      customerId: query.data.customerId,
      detail: query.data.detail,
    });
  }, [query.data]);

  const onSubmit = (
    input: RouterInputs["project"]["createOrUpdateProject"]
  ) => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Saving Product...",
      success: "Product Saved",
      error: "Failed to Save Product",
    });
  };

  return (
    <Form {...form}>
      <DashboardFormContainer onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-baseline gap-3 mb-10">
          <h1>{isCreate ? "Create Product" : "Product Detail"}</h1>
          {query.isLoading && <Spinner />}
          <Breadcrumb
            items={[
              {
                label: "Products",
                icon: Home,
              },
              {
                label: "Products' List",
                href: "/app/products",
              },
              {
                label: isCreate ? "Create Product" : `Product: ${productId}`,
              },
            ]}
          />
        </div>
        {query.isLoadingError ? (
          <>
            <X className="text-destructive mx-auto w-24 h-24" />
            <h2 className="text-center text-destructive my-5">
              Product not found
            </h2>
          </>
        ) : (
          <>
            <div className="flex gap-y-3 gap-x-5 mb-3">
              <FormItem className=" min-w-72">
                <Label>Product Picture</Label>
                <div className=" aspect-square border">
                  <p>TODO: Image Upload</p>
                </div>
              </FormItem>
              <div className="flex flex-col gap-y-3">
                <div className="grid grid-cols-5 gap-x-5">
                  <FormItem>
                    <Label>Product Number</Label>
                    <Input />
                  </FormItem>
                  <FormItem className=" col-span-2">
                    <Label>Name</Label>
                    <Input />
                  </FormItem>
                  <FormItem>
                    <Label>Type</Label>
                    <p>TODO: Select</p>
                  </FormItem>
                </div>
                <FormItem className=" col-span-2 flex-1 flex flex-col">
                  <Label>Description</Label>
                  <Textarea className="flex-1" />
                </FormItem>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-10">
              <FormItem>
                <Label>Barcode</Label>
                <Input />
              </FormItem>
              <FormItem>
                <Label>Code</Label>
                <Input />
              </FormItem>
              <FormItem>
                <Label>Category</Label>
                <p>TODO: Combobox with Create Value</p>
              </FormItem>
              <FormItem>
                <Label>Selling Price</Label>
                <Input />
              </FormItem>
              <FormItem>
                <Label>VAT</Label>
                <Input />
              </FormItem>
              <FormItem>
                <Label>Income Account</Label>
                <Input value="NEXT PHASE IGNORE" disabled />
              </FormItem>
              <FormItem>
                <Label>Stock</Label>
                <Input />
              </FormItem>
              <FormItem>
                <Label>Unit</Label>
                <p>TODO: Combobox with Create Value</p>
              </FormItem>
            </div>
            {/* <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-10">
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
            </div> */}
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
          </>
        )}
      </DashboardFormContainer>
    </Form>
  );
}
