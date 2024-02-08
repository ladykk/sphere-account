"use client";

import { DashboardFormContainer } from "@/components/layouts/dashboard";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FileUploadDropzone } from "@/components/ui/file-upload";
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
import { Textarea } from "@/components/ui/textarea";
import { cn, handleTRPCFormError } from "@/lib/utils";
import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { CheckIcon, Home, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import trash from "@/assets/icon/trash.svg";
import pluscircle from "@/assets/icon/plus-circle.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import TrashRed from "@/assets/icon/Trash-Red.png";
import { AttachmentTable } from "@/components/customer/attachmenttable";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.customerId as string;
  const isCreate = projectId === "create";

  const [isEdit, setIsEdit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const query = api.project.getProject.useQuery(projectId, {
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
      router.replace(`/app/customers/${id}`);
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
      loading: "Saving Project...",
      success: "Project Saved",
      error: "Failed to Save Project",
    });
  };

  return (
    <Form {...form}>
      <DashboardFormContainer onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-baseline gap-3 mb-10 justify-between">
          <div className="flex gap-3 justify-end">
            {" "}
            <h1>{isCreate ? "Create Customer" : "Customer Detail"}</h1>
            {query.isLoading && <Spinner />}
            <Breadcrumb
              items={[
                {
                  label: "Customers",
                  icon: Home,
                },
                {
                  label: "Cusomters' List",
                  href: "/app/customers",
                },
                {
                  label: isCreate
                    ? "Create Customer"
                    : `Customer: ${projectId}`,
                },
              ]}
            />
          </div>

          <div className="flex justify-end items-center gap-5  mt-10">
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
        </div>
        {/* {query.isLoadingError ? (
          <>
            <X className="text-destructive mx-auto w-24 h-24" />
            <h2 className="text-center text-destructive my-5">
              Project not found
            </h2>
          </>
        ) : ( */}
        <>
          <Tabs defaultValue="information">
            <TabsList className=" bg-transparent">
              <TabsTrigger
                value="information"
                className=" data-[state=active]:bg-orange-500 rounded-t-lg bg-gray-400 text-white pl-6 pt-3 pb-3 pr-6 rounded-b-none data-[state=active]:text-white w-36"
              >
                information
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className=" data-[state=active]:bg-orange-500 rounded-t-lg bg-gray-400 text-white pl-6 pt-3 pb-3 pr-6 rounded-b-none data-[state=active]:text-white w-36"
              >
                Bank Account
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className=" data-[state=active]:bg-orange-500 rounded-t-lg bg-gray-400 text-white pl-6 pt-3 pb-3 pr-6 rounded-b-none data-[state=active]:text-white w-36"
              >
                Contact
              </TabsTrigger>
              <TabsTrigger
                value="attachment"
                className=" data-[state=active]:bg-orange-500 rounded-t-lg bg-gray-400 text-white pl-6 pt-3 pb-3 pr-6 rounded-b-none data-[state=active]:text-white w-36"
              >
                Attachment
              </TabsTrigger>
              <TabsTrigger
                value="note"
                className=" data-[state=active]:bg-orange-500 rounded-t-lg bg-gray-400 text-white pl-6 pt-3 pb-3 pr-6 rounded-b-none data-[state=active]:text-white w-36"
              >
                Note
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="information"
              className="p-6 shadow-lg rounded-b-lg"
            >
              <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
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
                      <FormLabel>Tax ID</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <h3>Business Detail</h3>
              <Separator className="mt-2 bg-black"></Separator>
              <div className=" space-y-3 mt-3">
                <p> Business Type</p>
                <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-10 mt-4">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-12"
                      >
                        {value
                          ? frameworks.find(
                              (framework) => framework.value === value
                            )?.label
                          : "Select Business Type"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className=" p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search framework..."
                          className="h-9"
                        />
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              {framework.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  value === framework.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="Is-Branch" />
                  <Label htmlFor="Is-Branch">Is Branch</Label>
                </div>
                <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-10 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Name</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Code</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-4 mt-4"></div>
            </TabsContent>
            <TabsContent value="account" className="p-6 shadow-lg rounded-b-lg">
              <h3>Account Information</h3>
              <Separator className="mt-2 bg-black"></Separator>
              <div className=" mt-6 flex justify-between items-center">
                <p className=" text-orange-500 font-semibold"> Account 1</p>
                <Button variant="link">
                  <div className="flex gap-2 text-red-500">
                    <p>remove</p>
                    <Image src={TrashRed} alt="Trash"></Image>
                  </div>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Branch</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Date</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <Button
                  variant="link"
                  className=" text-orange-500 w-36  justify-start p-0"
                >
                  <p> + Add Account </p>
                </Button>
                <Button
                  variant="link"
                  className=" text-orange-500 w-36 justify-start p-0"
                >
                  <p> + Add Attachment </p>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="contact" className="p-6 shadow-lg rounded-b-lg">
              <h3>Contact</h3>
              <Separator className="mt-2 bg-black"></Separator>
              <div className="grid grid-cols-2 mb-6 gap-4 mt-3">
                {" "}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <Textarea {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Address</FormLabel>
                      <Textarea {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-10 mt-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Address</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="mt-2 bg-black"></Separator>

              <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-10 mt-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-10 mt-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fax Number</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent
              value="attachment"
              className="p-6 shadow-lg rounded-b-lg"
            >
              <AttachmentTable />
            </TabsContent>
            <TabsContent value="note" className="p-6 shadow-lg rounded-b-lg">
              <div className=" space-y-2">
                <Label>Note</Label>
                <p className=" text-muted-foreground">
                  2024/02/07 14:23 - Miss XXXXX X.
                </p>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </div>
              <Button
                variant="link"
                className=" text-orange-500 w-36 justify-start p-0 mt-3"
              >
                <p> + Add Note </p>
              </Button>
            </TabsContent>
          </Tabs>
        </>
        {/* )} */}
      </DashboardFormContainer>
    </Form>
  );
}
