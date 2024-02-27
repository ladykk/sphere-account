"use client";
import { TabsContent } from "@/components/ui/tabs";
import { DefaultValues, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { CUSTOMER_TYPE } from "@/static/customer";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ComboBox } from "@/components/ui/combo-box";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useMemo } from "react";
import { FormInput } from "../_meta";

type Props = {
  tabContentClassName: string;
  form: UseFormReturn<FormInput>;
  customerId: string;
  isCreate: boolean;
  defaultValue: DefaultValues<FormInput>;
  setDisable: (value: boolean) => void;
};

export const InfomationTab = ({
  tabContentClassName,
  form,
  customerId,
  isCreate,
  defaultValue,
  setDisable,
}: Props) => {
  const businessTypeQueries = api.customer.getBusinessTypes.useQuery();
  const query = api.customer.getCustomer.useQuery(customerId, {
    enabled: !isCreate,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const getVatServiceMutation = api.rdApi.getVatService.useMutation({
    onMutate: () => {
      setDisable(true);
    },
    onSettled: () => {
      setDisable(false);
    },
  });

  const isBranch = form.watch("isBranch");
  const businessType = form.watch("businessType");

  // Dynamic Options
  const businessTypeOptions = useMemo(() => {
    return [...(businessTypeQueries.data ?? []), businessType]
      .reduce((acc, curr) => {
        if (!curr) return acc;
        if (acc.find((item) => item === curr)) return acc;
        return [...acc, curr];
      }, [] as string[])
      .toSorted();
  }, [businessType, businessTypeQueries.data]);

  return (
    <TabsContent value="information" className={tabContentClassName}>
      <div className="grid grid-cols-3 gap-y-3 gap-x-5 mb-5">
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
              <div className="flex justify-between items-center h-6 gap-1.5">
                <FormLabel>Tax ID</FormLabel>
                {getVatServiceMutation.isPending && (
                  <Spinner className="mr-auto w-4 h-4" />
                )}
                {isCreate && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      if (!field.value) return;
                      toast.promise(
                        getVatServiceMutation.mutateAsync(field.value),
                        {
                          loading: "Fetching Data from RD...",
                          success: (data) => {
                            form.setValue(
                              "name",
                              `${data.TitleName} ${data.Name} ${data.Surname}`.trim()
                            );
                            form.setValue(
                              "type",
                              ["นาย", "นาง", "นางสาว"].includes(data.TitleName)
                                ? "person"
                                : "coperate"
                            );
                            const isBranch = data.BranchNumber > 0;
                            form.setValue("isBranch", isBranch);
                            form.setValue(
                              "branchCode",
                              isBranch ? data.BranchNumber.toString() : ""
                            );
                            form.setValue(
                              "branchName",
                              isBranch ? data.BranchName : ""
                            );
                            form.setValue("zipcode", data.PostCode);
                            let address = "";
                            if (data.BuildingName) address += data.BuildingName;
                            if (data.FloorNumber)
                              address += ` ชั้น ${data.FloorNumber}`;
                            if (data.RoomNumber)
                              address += ` ห้อง ${data.RoomNumber}`;
                            if (data.VillageName)
                              address += ` หมู่บ้าน ${data.VillageName}`;
                            if (data.HouseNumber)
                              address += ` เลขที่ ${data.HouseNumber}`;
                            if (data.MooNumber)
                              address += ` หมู่ ${data.MooNumber}`;
                            if (data.SoiName) address += ` ซอย ${data.SoiName}`;
                            if (data.StreetName)
                              address += ` ถนน ${data.StreetName}`;
                            if (data.Yaek) address += ` แยก ${data.Yaek}`;
                            if (data.Thambol)
                              address += ` ตำบล ${data.Thambol}`;
                            if (data.Amphur) address += ` อำเภอ ${data.Amphur}`;
                            if (data.Province)
                              address += ` จังหวัด ${data.Province}`;
                            address = address.trim();

                            form.setValue("address", address);
                            return `Found Data with Tax ID: "${field.value}"`;
                          },
                          error: (error) => {
                            return `No Data Found with Tax ID: "${field.value}"`;
                          },
                        }
                      );
                    }}
                    className="h-fit p-0 text-primary"
                    size="sm"
                    disabled={
                      !field.value || field.disabled || field.value.length < 1
                    }
                  >
                    Import from RD
                  </Button>
                )}
              </div>
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
                disabled={field.disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(CUSTOMER_TYPE).map(([key, value]) => (
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
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Is Active</FormLabel>
              <div className="h-10 flex items-center">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={field.disabled}
                  />
                </FormControl>
              </div>
              <FormMessage />
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
              <FormControl>
                <ComboBox
                  options={businessTypeOptions}
                  setLabel={(label) => label}
                  setValue={(value) => value}
                  value={field.value}
                  onChange={field.onChange}
                  multiple={false}
                  creatable={true}
                  disabled={field.disabled}
                  loading={businessTypeQueries.isLoading}
                  placeholder="Select Business Type"
                  searchPlaceholder="Search Business Type"
                  searchNoResultText="No Business Type Found"
                  clearable={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isBranch"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Is Branch</FormLabel>
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
                          query.data?.branchCode ??
                            defaultValue.branchCode ??
                            null,
                          {
                            shouldDirty: false,
                          }
                        );
                        form.setValue(
                          "branchName",
                          query.data?.branchName ??
                            defaultValue.branchName ??
                            null,
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
              name="branchCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Code</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchName"
              render={({ field }) => (
                <FormItem className=" col-span-2">
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
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
          <FormField
            control={form.control}
            name="shippingZipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Zipcode</FormLabel>
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
          <FormField
            control={form.control}
            name="creditDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={Number(field.value) || ""}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || null)
                    }
                    type="number"
                    min="0"
                    max="31"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </TabsContent>
  );
};
