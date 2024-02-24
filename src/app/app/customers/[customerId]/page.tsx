"use client";

import { DashboardFormWrapper } from "@/components/layouts/dashboard";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { AutoSizeTextarea, Textarea } from "@/components/ui/textarea";
import { handleTRPCFormError } from "@/lib/utils";
import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { Home, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Switch } from "@/components/ui/switch";
import TrashRed from "@/assets/icon/Trash-Red.png";
import { AttachmentTable } from "@/components/customer/attachmenttable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type FormInput = RouterInputs["customer"]["createOrUpdateCustomer"] & {
  files: {
    attachements: File[];
  };
};

const defaultValue: DefaultValues<FormInput> = {
  id: undefined,
  code: "",
  name: "",
  type: "person",
  taxId: "",
  address: "",
  zipcode: "",
  shippingAddress: "",
  shippingZipcode: "",
  isBranch: false,
  branchCode: "",
  branchName: "",
  businessType: "",
  email: "",
  telephoneNumber: "",
  phoneNumber: "",
  faxNumber: "",
  website: "",
  creditDate: undefined,
  notes: "",
  isActive: true,
  contacts: [],
  bankAccounts: [],
  attachments: [],
};

const tabTriggerClassName =
  "data-[state=active]:bg-orange-500 rounded-t-lg bg-gray-400 text-white pl-6 pt-3 pb-3 pr-6 rounded-b-none data-[state=active]:text-white w-36";
const tabContentClassName =
  "p-6 shadow-lg rounded-b-lg bg-white mt-0 rounded-tr-lg border";

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.customerId as string;
  const isCreate = customerId === "create";

  const [isEdit, setIsEdit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const query = api.customer.getCustomer.useQuery(customerId, {
    enabled: !isCreate,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const form = useForm<FormInput>({
    disabled: (isCreate ? false : !isEdit) || isDisabled || query.isLoading,
    defaultValues: defaultValue,
  });

  const presignUrlMutation = api.customer.generatePresignUrl.useMutation();
  const mutation = api.customer.createOrUpdateCustomer.useMutation({
    onSuccess: (id, variables) => {
      router.replace(`/app/customers/${id}`);
      form.reset(variables);
      setIsEdit(false);
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
        type: query.data.type,
        taxId: query.data.taxId,
        address: query.data.address,
        zipcode: query.data.zipcode,
        shippingAddress: query.data.shippingAddress,
        shippingZipcode: query.data.shippingZipcode,
        isBranch: query.data.isBranch,
        branchCode: query.data.branchCode,
        branchName: query.data.branchName,
        businessType: query.data.businessType,
        email: query.data.email,
        telephoneNumber: query.data.telephoneNumber,
        phoneNumber: query.data.phoneNumber,
        faxNumber: query.data.faxNumber,
        website: query.data.website,
        creditDate: query.data.creditDate,
        notes: query.data.notes,
        isActive: query.data.isActive,
        contacts: query.data.contacts.map((contact) => ({
          id: contact.id,
          contactName: contact.contactName,
          phoneNumber: contact.phoneNumber,
          email: contact.email,
          isActive: contact.isActive,
        })),
        bankAccounts: query.data.bankAccounts.map((account) => ({
          id: account.id,
          accountNumber: account.accountNumber,
          bank: account.bank,
          bankBranch: account.bankBranch,
          accountType: account.accountType,
          isActive: account.isActive,
        })),
        attachments: query.data.attachments.map((attachment) => ({
          id: attachment.id,
          fileId: attachment.fileId,
          fileName: attachment.fileName,
          fileSize: attachment.fileSize,
          fileCategory: attachment.fileCategory,
          uploadedBy: attachment.uploadedBy,
          uploadedAt: attachment.uploadedAt,
        })),
      });
    }
  }, [query.data, isEdit, isCreate]);

  const onSubmit = (input: FormInput) => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Saving Project...",
      success: "Project Saved",
      error: "Failed to Save Project",
    });
  };

  const isBranch = form.watch("isBranch");

  return (
    <Form {...form}>
      <DashboardFormWrapper
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-screen-2xl"
      >
        <div className="flex items-baseline gap-3 mb-5 justify-between">
          <div className="flex gap-3 items-baseline justify-end">
            <h1>{isCreate ? "Create Customer" : "Customer Detail"}</h1>
            {query.isLoading && <Spinner />}
            <Breadcrumb
              items={[
                {
                  label: "Customers",
                  icon: Home,
                },
                {
                  label: "Customers' List",
                  href: "/app/customers",
                },
                {
                  label: isCreate
                    ? "Create Customer"
                    : `Customer: ${customerId}`,
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
              Customer not found
            </h2>
          </>
        ) : (
          <Tabs defaultValue="information">
            <TabsList className="bg-transparent p-0 h-fit">
              <TabsTrigger value="information" className={tabTriggerClassName}>
                Information
              </TabsTrigger>
              <TabsTrigger value="bankAccounts" className={tabTriggerClassName}>
                Bank Accounts
              </TabsTrigger>
              <TabsTrigger value="contacts" className={tabTriggerClassName}>
                Contact Persons
              </TabsTrigger>
              <TabsTrigger value="attachments" className={tabTriggerClassName}>
                Attachment
              </TabsTrigger>
              <TabsTrigger value="note" className={tabTriggerClassName}>
                Note
              </TabsTrigger>
            </TabsList>
            <TabsContent value="information" className={tabContentClassName}>
              <div className="grid grid-cols-5 gap-y-3 gap-x-5 mb-5">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Code</FormLabel>
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
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={query.data?.type ?? defaultValue.type}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>{}</SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <h3>Business Detail</h3>
              <Separator className="mt-2" />
              <div className="mt-3 grid grid-cols-3 gap-x-5 gap-y-3 mb-5">
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>

                      <Select
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                        disabled={field.disabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Business Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="person">Person</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isBranch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is Branch</FormLabel>
                      <div className="h-10 flex items-center">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) => {
                              field.onChange(value);

                              if (!value) {
                                form.setValue("branchCode", "");
                                form.setValue("branchName", "");
                              } else {
                                form.setValue(
                                  "branchCode",
                                  query.data?.branchCode,
                                  {
                                    shouldDirty: false,
                                  }
                                );
                                form.setValue(
                                  "branchName",
                                  query.data?.branchName,
                                  {
                                    shouldDirty: false,
                                  }
                                );
                              }
                            }}
                            disabled={field.disabled}
                          />
                        </FormControl>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div />
                {isBranch && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch Code</FormLabel>
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
                        <FormItem className=" col-span-2">
                          <FormLabel>Branch Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <h3>Contact</h3>
              <Separator className="mt-2" />
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            className=" min-h-40"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Address</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            className=" min-h-40"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zipcode</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-3 gap-x-5 gap-y-3">
                  <FormField
                    control={form.control}
                    name="telephoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telephone Number</FormLabel>
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
                      <FormItem>
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
                    name="faxNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fax Number</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="bankAccounts" className={tabContentClassName}>
              <FormField
                control={form.control}
                name="bankAccounts"
                render={({ field }) => (
                  <div className="space-y-3">
                    {field.value.map((account, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center">
                          <p className=" text-orange-500 font-semibold">
                            Account {index + 1}
                          </p>
                          {(isEdit || isCreate) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="link"
                                  className="text-red-500 gap-1.5"
                                  type="button"
                                >
                                  <p>Remove</p>
                                  <Image
                                    src={TrashRed}
                                    alt={`remove bank account ${index + 1}`}
                                    className=" w-5 h-5"
                                  ></Image>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure to remove this bank account?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Account {index + 1} will be removed from the
                                    customer's bank account list.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogAction
                                    className={buttonVariants({
                                      variant: "destructive",
                                    })}
                                    onClick={() => {
                                      const currents = field.value ?? [];
                                      field.onChange(
                                        currents.filter((_, i) => i !== index)
                                      );
                                    }}
                                  >
                                    Remove
                                  </AlertDialogAction>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-y-3 gap-x-5">
                          <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.accountNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.bank`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bank</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.bankBranch`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Branch</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.accountType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Type</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.creditDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Credit Date</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    {(isEdit || isCreate) && (
                      <Button
                        variant="link"
                        className=" text-orange-500 justify-start p-0"
                        type="button"
                        onClick={() => {
                          const currents = field.value ?? [];
                          field.onChange([...currents, {}]);
                        }}
                      >
                        + Add Bank Account
                      </Button>
                    )}
                  </div>
                )}
              />
              {/* <div className="flex flex-col">
                <Button
                  variant="link"
                  className=" text-orange-500 w-36 justify-start p-0"
                >
                  <p> + Add Attachment </p>
                </Button>
              </div> */}
            </TabsContent>
            <TabsContent value="contacts" className={tabContentClassName}>
              <FormField
                control={form.control}
                name="contacts"
                render={({ field }) => (
                  <div className="space-y-3">
                    {field.value.map((contact, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center">
                          <p className="text-orange-500 font-semibold">
                            Contact Person {index + 1}
                          </p>
                          {(isEdit || isCreate) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="link"
                                  className="text-red-500 gap-1.5"
                                  type="button"
                                >
                                  <p>Remove</p>
                                  <Image
                                    src={TrashRed}
                                    alt={`remove contact person ${index + 1}`}
                                    className=" w-5 h-5"
                                  ></Image>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure to remove this contact person?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Account {index + 1} will be removed from the
                                    customer's contact person list.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogAction
                                    className={buttonVariants({
                                      variant: "destructive",
                                    })}
                                    onClick={() => {
                                      const currents = field.value ?? [];
                                      field.onChange(
                                        currents.filter((_, i) => i !== index)
                                      );
                                    }}
                                  >
                                    Remove
                                  </AlertDialogAction>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-y-3 gap-x-5">
                          <FormField
                            control={form.control}
                            name={`contacts.${index}.contactName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`contacts.${index}.phoneNumber`}
                            render={({ field }) => (
                              <FormItem>
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
                            name={`contacts.${index}.email`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    {(isEdit || isCreate) && (
                      <Button
                        variant="link"
                        className=" text-orange-500 justify-start p-0"
                        type="button"
                        onClick={() => {
                          const currents = field.value ?? [];
                          field.onChange([...currents, {}]);
                        }}
                      >
                        + Add Contact Person
                      </Button>
                    )}
                  </div>
                )}
              />
            </TabsContent>
            <TabsContent value="attachments" className={tabContentClassName}>
              <p>TODO: Add Submit Logic</p>
              <AttachmentTable />
            </TabsContent>
            <TabsContent value="note" className={tabContentClassName}>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <AutoSizeTextarea
                        {...field}
                        value={field.value ?? ""}
                        className=" min-h-96"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        )}
      </DashboardFormWrapper>
    </Form>
  );
}
