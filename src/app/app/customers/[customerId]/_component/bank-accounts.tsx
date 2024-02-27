import { DefaultValues, UseFormReturn, useFieldArray } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComboBox } from "@/components/ui/combo-box";
import { useMemo } from "react";
import { api } from "@/trpc/react";
import { Switch } from "@/components/ui/switch";
import { Paperclip, Plus, Trash2 } from "lucide-react";
import { CustomerTab, FormInput, defaultBankAccount } from "../_meta";

type Props = {
  tabContentClassName: string;
  form: UseFormReturn<FormInput>;
  isCreate: boolean;
  isEdit: boolean;
  setTab: (tab: CustomerTab) => void;
};

export const BankAccountsTab = ({
  tabContentClassName,
  form,
  isEdit,
  isCreate,
  setTab,
}: Props) => {
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "bankAccounts",
  });

  const banksQueries = api.customer.getBanks.useQuery();
  const bankAccountTypesQueries = api.customer.getBankAccountTypes.useQuery();

  const bankAccounts = form.watch("bankAccounts") ?? [];
  const attachments = form.watch("attachments");

  const bankAccountAttachments = attachments.filter(
    (attachment) => attachment.fileCategory === "bankAccounts"
  );

  // Dynamic options
  const banksOptions = useMemo(() => {
    return [
      ...(banksQueries.data ?? []),
      ...bankAccounts.map((account) => account.bank),
    ]
      .reduce((acc, bank) => {
        if (!bank) return acc;
        if (acc.find((b) => b === bank)) return acc;
        return [...acc, bank];
      }, [] as string[])
      .toSorted();
  }, [banksQueries.data, bankAccounts]);

  const bankAccountTypesOptions = useMemo(() => {
    return [
      ...(bankAccountTypesQueries.data ?? []),
      ...bankAccounts.map((account) => account.accountType),
    ]
      .reduce((acc, accountType) => {
        if (!accountType) return acc;
        if (acc.find((b) => b === accountType)) return acc;
        return [...acc, accountType];
      }, [] as string[])
      .toSorted();
  }, [bankAccountTypesQueries.data, bankAccounts]);

  return (
    <TabsContent value="bankAccounts" className={tabContentClassName}>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex justify-between items-center">
              <p className=" text-orange-500 font-semibold">
                Account {index + 1}
              </p>
              <FormField
                control={form.control}
                name={`bankAccounts.${index}.isActive`}
                render={({ field }) => (
                  <FormItem className="ml-auto">
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormLabel required>Is Active</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(isEdit || isCreate) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="link"
                      className="text-red-500 gap-1.5"
                      type="button"
                    >
                      <p>Remove</p>
                      <Trash2 className=" w-5 h-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure to remove this bank account?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Account {index + 1} will be removed from the customer's
                        bank account list.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        className={buttonVariants({
                          variant: "destructive",
                        })}
                        onClick={() => {
                          remove(index);
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
                    <FormLabel required>Account Number</FormLabel>
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
                    <FormLabel required>Bank</FormLabel>
                    <FormControl>
                      <ComboBox
                        options={banksOptions}
                        setLabel={(label) => label}
                        setValue={(value) => value}
                        value={field.value}
                        onChange={field.onChange}
                        multiple={false}
                        creatable={true}
                        disabled={field.disabled}
                        loading={banksQueries.isLoading}
                        placeholder="Select Bank"
                        searchPlaceholder="Search Bank"
                        searchNoResultText="No Bank Found"
                      />
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
                    <FormLabel required>Branch</FormLabel>
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
                    <FormLabel required>Account Type</FormLabel>
                    <FormControl>
                      <ComboBox
                        options={bankAccountTypesOptions}
                        setLabel={(label) => label}
                        setValue={(value) => value}
                        value={field.value}
                        onChange={field.onChange}
                        multiple={false}
                        creatable={true}
                        disabled={field.disabled}
                        loading={bankAccountTypesQueries.isLoading}
                        placeholder="Select Account Type"
                        searchPlaceholder="Search Account Type"
                        searchNoResultText="No Account Type Found"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3">
          {(isEdit || isCreate) && (
            <Button
              variant="link"
              className=" text-orange-500 justify-start p-0"
              type="button"
              onClick={() => {
                append(defaultBankAccount);
              }}
            >
              <Plus className="w-5 h-5 mr-1.5" />
              Add Bank Account
            </Button>
          )}
          <Button
            variant="link"
            className=" text-orange-500 justify-start p-0"
            type="button"
            onClick={() => setTab("attachments")}
          >
            {bankAccountAttachments.length > 0 ? (
              <>
                <Paperclip className="w-5 h-5 mr-1.5" />
                View {bankAccountAttachments.length} Attachment(s)
              </>
            ) : isEdit ? (
              <>
                <Plus className="w-5 h-5 mr-1.5" />
                Add Attachment
              </>
            ) : (
              <>
                <Paperclip className="w-5 h-5 mr-1.5" />
                No Attachment
              </>
            )}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};
