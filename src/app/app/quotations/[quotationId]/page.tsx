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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

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
      loading: "Saving Project...",
      success: "Project Saved",
      error: "Failed to Save Project",
    });
  };

  return (
    <Form {...form}>
      <DashboardFormContainer onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-baseline gap-3 mb-10 justify-between">
          <div className="flex">
            <h1>{isCreate ? "Create Quotation" : "Quotation Detail:"}</h1>
            <h1 className=" text-orange-500 ml-2"> QT2024010001</h1>
          </div>

          <Button
            variant="ghost"
            className=" border border-orange-400 shadow-lg rounded-2xl text-orange-500"
          >
            Download PDF
          </Button>
        </div>
        <div className=" grid grid-cols-2 p-6 shadow-md rounded-lg">
          <div className=" max-w-xl space-y-3">
            {" "}
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
              name="detail"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Detail</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      className=" h-40"
                      placeholder="Address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=" grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Zip Code" />
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
                    <FormControl>
                      <Input {...field} placeholder="Tax ID" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=" grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Branch Name" />
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
                    <FormControl>
                      <Input {...field} placeholder="Branch Code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className=" flex-col items-end flex">
            <h2 className=" text-muted-foreground"> Grand Total:</h2>
            <h2 className=" text-primary">22,2000</h2>
            <div className=" space-y-4 mt-6">
              {" "}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className=" w-28">Date:</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="w-full" />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className=" w-28">Credit (Day):</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="30" />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className=" w-28">Due Date:</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className=" w-28">Sales Name:</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Dararat Cha." />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className=" w-28">Currency:</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="THB-ไทย" />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div />

        <div className="p-6 shadow-md mt-4 space-y-4">
          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className=" w-2/3">
                  <FormLabel className=" w-28">Project</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Select Project" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className=" w-1/3">
                  <FormLabel className=" w-28">Ref</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="THB-ไทย" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                    className=" h-40"
                    placeholder="Address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="p-6 shadow-md mt-4">
          <Table className=" rounded-3xl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No.</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Unit price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border">
              <TableRow>
                <TableCell className="text-center">1</TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="THB-ไทย" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>XXXXXXXXXXXXXXXXXXXXXXXXX</TableCell>
                <TableCell className="text-right">
                  {" "}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="THB-ไทย" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="THB-ไทย" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="THB-ไทย" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="THB-ไทย" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="grid grid-cols-2 mt-4">
            <div>
              <Button className=" rounded-2xl bg-white text-orange-500 border-1 border border-orange-500 mt-4">
                + Add Product
              </Button>
              <div className="flex gap-6 max-w-3xl mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Remark:</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-32" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Internal Note:</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-32" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col items-end mt-6 space-y-2">
              <div className="flex justify-between w-80">
                <p>Amount:</p> <div>100</div>
              </div>
              <div className="flex justify-between w-80">
                <p>Discount:</p> <div>100</div>
              </div>
              <div className="flex justify-between w-80">
                <p>Amount after discount:</p> <div>100</div>
              </div>
              <div className="flex justify-between w-80">
                <p>Vat Include:</p> <div>100</div>
              </div>
              <div className="flex justify-between w-80">
                <p>Total Amount:</p> <div>100</div>
              </div>
              <Separator className="w-80"></Separator>
              <div className="flex justify-start w-80 gap-2">
                {" "}
                <Checkbox
                  value={false}
                  onChange={function (value: boolean): void {
                    throw new Error("Function not implemented.");
                  }}
                ></Checkbox>{" "}
                with holding tax
              </div>
              <div className="flex justify-start w-80 gap-2">
                {" "}
                <Checkbox
                  value={false}
                  onChange={function (value: boolean): void {
                    throw new Error("Function not implemented.");
                  }}
                ></Checkbox>{" "}
                Electronic Signature
              </div>
            </div>
          </div>
          <p>Attachment</p>
        </div>

        <div className="flex justify-end items-center gap-5 mt-9">
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
                <Button
                  type="button"
                  onClick={() => setIsEdit(true)}
                  className=" w-32"
                >
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
