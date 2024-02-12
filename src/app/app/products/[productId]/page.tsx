"use client";

import { AvatarInput } from "@/components/auth/avatar-input";
import { DashboardFormContainer } from "@/components/layouts/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input, NumberInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
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

type FormInput = RouterInputs["product"]["createOrUpdateProduct"] & {
  files: {
    image: File | null;
  };
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  const isCreate = productId === "create";

  const [isEdit, setIsEdit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const query = api.product.getProduct.useQuery(productId, {
    enabled: !isCreate,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const catagoriesQuery = api.product.getCatagories.useQuery();
  const unitsQuery = api.product.getUnits.useQuery();

  const form = useForm<FormInput>({
    disabled: (isCreate ? false : !isEdit) || isDisabled || query.isLoading,
  });

  const presignImageMutation = api.product.generatePresignUrl.useMutation();
  const createOrUpdateMutation = api.product.createOrUpdateProduct.useMutation({
    onSuccess: (id, variables) => {
      router.replace(`/app/products/${id}`);
      form.reset(variables);
    },
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
    onMutate: () => setIsDisabled(true),
    onSettled: () => setIsDisabled(false),
  });

  const mutation = useMutation<void, Error, FormInput>({
    mutationFn: async (input) => {
      let { files, ...data } = input;

      //Upload image
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

      await createOrUpdateMutation.mutateAsync({
        ...data,
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
      type: query.data.type,
      name: query.data.name,
      code: query.data.code,
      category: query.data.category,
      barcode: query.data.barcode,
      sellingPrice: String(query.data.sellingPrice),
      vatType: query.data.vatType,
      description: query.data.description,
      unit: query.data.unit,
      image: query.data.image,
    });
  }, [query.data]);

  const onSubmit = (input: FormInput) => {
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
        {query.isLoadingError && !isCreate ? (
          <>
            <X className="text-destructive mx-auto w-24 h-24" />
            <h2 className="text-center text-destructive my-5">
              Product not found
            </h2>
          </>
        ) : (
          <>
            <div className="flex gap-y-3 gap-x-5 mb-3">
              <FormField
                control={form.control}
                name="files.image"
                render={({ field }) => (
                  <div>
                    <FormLabel> Product Picture </FormLabel>
                    <FormControl>
                      <AvatarInput {...field}>
                        {(fileUrl) => (
                          <Avatar className="w-60 h-60 rounded-md border shadow border-input cursor-pointer hover:opacity-70 transition-opacity">
                            <AvatarImage
                              src={fileUrl ?? query.data?.image ?? ""}
                            ></AvatarImage>
                            <AvatarFallback className="text-3xl rounded-md">
                              {getNamePrefix(query.data?.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </AvatarInput>
                    </FormControl>
                    <FormMessage />
                    {!field.value && (
                      <p className="w-full text-center text-xs mt-2 text-muted-foreground">
                        Click to upload
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="flex flex-col gap-y-3">
                <div className="grid grid-cols-5 gap-x-5">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Code </FormLabel>
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
                      <FormItem className="col-span-2">
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
                    name="type"
                    render={({ field }) => (
                      <FormItem className=" col-span-2">
                        <FormLabel>Type</FormLabel>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                          disabled={field.disabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="stock">Stock</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className=" col-span-2 flex-1 flex flex-col">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          className="flex-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-10">
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <ComboBox
                        options={catagoriesQuery.data}
                        setLabel={(label) => label ?? ""}
                        setValue={(value) => value ?? ""}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        multiple={false}
                        creatable={true}
                        disabled={field.disabled}
                      ></ComboBox>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <ComboBox
                        options={unitsQuery.data}
                        setLabel={(label) => label ?? ""}
                        setValue={(value) => value ?? ""}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        multiple={false}
                        creatable={true}
                        disabled={field.disabled}
                      ></ComboBox>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price (Baht)</FormLabel>
                    <FormControl>
                      <NumberInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vatType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                      disabled={field.disabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="include">Include VAT</SelectItem>
                        <SelectItem value="exclude">Exclude VAT</SelectItem>
                        <SelectItem value="exempt">VAT Exempt</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormItem>
                <Label>Income Account</Label>
                <Input disabled />
              </FormItem>
              <FormItem>
                <Label>Stock</Label>
                <Input disabled />
              </FormItem>
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
          </>
        )}
      </DashboardFormContainer>
    </Form>
  );
}
