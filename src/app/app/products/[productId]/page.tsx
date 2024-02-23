"use client";
import {
  DashboardFormWrapper,
  DashboardMainContainer,
} from "@/components/layouts/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combo-box";
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
import { Input, NumberInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { fileToPresignedUrlInput, uploadFile } from "@/lib/file";
import { handleTRPCFormError } from "@/lib/utils";
import { PRODUCT_TYPE, VAT_TYPE } from "@/static/product";
import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { useMutation } from "@tanstack/react-query";
import { Home, ImageOff, UploadCloud, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = RouterInputs["product"]["createOrUpdateProduct"] & {
  files: {
    image: File | null;
  };
};

const defaultValue: DefaultValues<FormInput> = {
  id: undefined,
  type: undefined,
  name: "",
  code: "",
  category: "",
  barcode: "",
  sellingPrice: "0",
  vatType: "include",
  description: "",
  unit: "",
  image: "",
  isActive: true,
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
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
  });

  const mutation = useMutation<string, Error, FormInput>({
    mutationFn: async (input) => {
      let { files, ...data } = input;
      toast.loading("Preparing...", {
        id: "product-detail",
        duration: Number.POSITIVE_INFINITY,
      });

      //Upload image
      if (files.image) {
        toast.loading("Uploading Image...", {
          id: "product-detail",
          duration: Number.POSITIVE_INFINITY,
        });
        const presignedUrl = await presignImageMutation.mutateAsync([
          fileToPresignedUrlInput(files.image),
        ]);

        data.image = (
          await uploadFile(presignedUrl[0], files.image, (progress) => {
            toast.loading(`Uploading Image... ${progress}%`, {
              id: "product-detail",
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

      toast.loading("Saving Product...", {
        id: "product-detail",
        duration: Number.POSITIVE_INFINITY,
      });
      return await createOrUpdateMutation.mutateAsync({
        ...data,
      });
    },
    onSuccess: (id, variables) => {
      form.reset(variables);
      setIsEdit(false);
      router.replace(`/app/products/${id}`);
      setTimeout(() => query.refetch(), 1000);
      toast.success("Product Saved Successfully", {
        id: "product-detail",
        duration: 5000,
      });
    },
    onError: (error) =>
      toast.error("Failed to Save Product", {
        id: "product-detail",
        duration: 5000,
      }),
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
        type: query.data.type,
        name: query.data.name,
        code: query.data.code,
        category: query.data.category,
        barcode: query.data.barcode,
        sellingPrice: query.data.sellingPrice.toString(),
        vatType: query.data.vatType,
        description: query.data.description,
        unit: query.data.unit,
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
                  label: isCreate
                    ? "Create Product"
                    : query.data
                    ? `${query.data.code}: ${query.data.name}`
                    : `Product: ${productId}`,
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
              Product not found
            </h2>
          </>
        ) : (
          <DashboardMainContainer className="space-y-3">
            <h5 className="font-bold">Infomation</h5>
            <Separator />
            <div className="flex gap-y-3 gap-x-5">
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
              <div className="flex flex-col gap-y-3 flex-1">
                <div className="grid grid-cols-3 gap-x-5">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. PRO0000000001" />
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
                        <FormLabel required>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
            <div className="grid grid-cols-3 gap-y-3 gap-x-5">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Type</FormLabel>
                    <Select
                      defaultValue={query.data?.type ?? defaultValue.type}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={field.disabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PRODUCT_TYPE).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Category</FormLabel>
                    <FormControl>
                      <ComboBox
                        options={catagoriesQuery.data}
                        setLabel={(label) => label}
                        setValue={(value) => value}
                        value={field.value}
                        onChange={field.onChange}
                        multiple={false}
                        creatable={true}
                        disabled={field.disabled}
                        loading={catagoriesQuery.isLoading}
                        placeholder="Select Category"
                        searchPlaceholder="Search Category"
                        searchNoResultText="No Category Found"
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
                    <FormLabel required>Unit</FormLabel>
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
                        loading={unitsQuery.isLoading}
                        placeholder="Select Unit"
                        searchPlaceholder="Search Unit"
                        searchNoResultText="No Unit Found"
                      ></ComboBox>
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
                    <FormLabel required>VAT Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={query.data?.vatType ?? defaultValue.vatType}
                      disabled={field.disabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select VAT Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(VAT_TYPE).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Selling Price (Baht)</FormLabel>
                    <FormControl>
                      <NumberInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                  </FormItem>
                )}
              />
            </div>
            {!isCreate && (
              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <div className="space-y-3">
                  <h5 className="font-bold">Accounting</h5>
                  <Separator />
                  <div>
                    <FormItem>
                      <Label>Income Account</Label>
                      <Input disabled />
                    </FormItem>
                  </div>
                </div>
                {query.data?.type === "stock" && (
                  <div className="space-y-3">
                    <h5 className="font-bold">Stock</h5>
                    <Separator />
                    <div>
                      <FormItem>
                        <Label>Stock</Label>
                        <Input
                          value={`${query.data?.stock ?? 0} ${
                            query.data?.unit ?? ""
                          }`}
                          disabled
                        />
                      </FormItem>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DashboardMainContainer>
        )}
      </DashboardFormWrapper>
    </Form>
  );
}
