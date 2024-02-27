"use client";

import { DashboardFormWrapper } from "@/components/layouts/dashboard";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { cn, handleTRPCFormError } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Home, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfomationTab } from "./_component/infomation";
import { BankAccountsTab } from "./_component/bank-accounts";
import { NoteTab } from "./_component/notes";
import { ContactPersonsTab } from "./_component/contact-person";
import { AttachementsTab } from "./_component/attachements";
import { useMutation } from "@tanstack/react-query";
import { fileToPresignedUrlInput, uploadFile } from "@/lib/file";
import { DataTableMetadata } from "@/components/ui/data-table";
import {
  CustomerTab,
  FormInput,
  defaultValue,
  tabContentClassName,
  tabTriggerClassName,
  tabTriggerInvalidClassName,
} from "./_meta";

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.customerId as string;
  const isCreate = customerId === "create";
  const [tab, setTab] = useState<CustomerTab>("information");

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
  const createOrUpdateMutation =
    api.customer.createOrUpdateCustomer.useMutation({
      onError: (error) =>
        handleTRPCFormError(error.data?.zodError, form.setError),
    });

  const mutation = useMutation<string, Error, FormInput>({
    mutationFn: async (input) => {
      let { files, ...data } = input;
      toast.loading("Preparing...", {
        id: "customer-detail",
        duration: Number.POSITIVE_INFINITY,
      });

      // Upload Attachments
      if (files.attachements.length > 0) {
        toast.loading("Upload Attachments...", {
          id: "customer-detail",
          duration: Number.POSITIVE_INFINITY,
        });
        const presignUrls = await presignUrlMutation.mutateAsync(
          files.attachements.map((attachement) =>
            fileToPresignedUrlInput(attachement.file)
          )
        );

        for (const [index, presignUrl] of presignUrls.entries()) {
          const uploadResult = await uploadFile(
            presignUrl,
            files.attachements[index].file,
            (progress) => {
              if (mutation.isPending)
                toast.loading(
                  `Uploading Attachments... (${index + 1} of ${
                    files.attachements.length
                  }) ${progress} %`,
                  {
                    id: "customer-detail",
                    duration: Number.POSITIVE_INFINITY,
                  }
                );
            }
          ).catch(async (err) => {
            form.setError("files.attachements", {
              type: "manual",
              message: err.message,
            });
            throw err;
          });

          data.attachments.push({
            id: undefined,
            fileUrl: uploadResult.url,
            fileCategory: files.attachements[index].fileCategory,
          });
        }
      }

      toast.loading("Saving Customer...", {
        id: "customer-detail",
        duration: Number.POSITIVE_INFINITY,
      });

      // Remove default values if not changed
      if (
        JSON.stringify(data.bankAccounts) ===
        JSON.stringify(defaultValue.bankAccounts)
      )
        data.bankAccounts = [];
      if (
        JSON.stringify(data.contacts) === JSON.stringify(defaultValue.contacts)
      )
        data.contacts = [];

      return await createOrUpdateMutation.mutateAsync({
        ...data,
      });
    },
    onSuccess: (id, variables) => {
      form.reset(variables);
      setIsEdit(false);
      router.replace(`/app/customers/${id}`);

      setTimeout(() => query.refetch(), 1000);
      toast.success("Customer Saved Successfully", {
        id: "customer-detail",
        duration: 5000,
      });
    },
    onError: (error) => {
      toast.error("Failed to Save Customer", {
        id: "customer-detail",
        duration: 5000,
      });
    },
    onMutate: () => setIsDisabled(true),
    onSettled: () => setIsDisabled(false),
  });

  const errorTabs = useMemo<Record<CustomerTab, boolean>>(() => {
    const errors = form.formState.errors;
    return {
      information:
        !!errors.code ||
        !!errors.name ||
        !!errors.taxId ||
        !!errors.type ||
        !!errors.isActive ||
        !!errors.businessType ||
        !!errors.isBranch ||
        !!errors.branchCode ||
        !!errors.branchName ||
        !!errors.address ||
        !!errors.zipcode ||
        !!errors.shippingAddress ||
        !!errors.shippingZipcode ||
        !!errors.email ||
        !!errors.telephoneNumber ||
        !!errors.phoneNumber ||
        !!errors.faxNumber ||
        !!errors.website ||
        !!errors.creditDate,
      bankAccounts: !!errors.bankAccounts,
      contacts: !!errors.contacts,
      notes: !!errors.notes,
      attachments: !!errors.attachments,
    };
  }, [form.formState]);

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
          fileUrl: attachment.fileUrl,
          fileName: attachment.fileName,
          fileSize: attachment.fileSize,
          fileCategory: attachment.fileCategory,
          uploadedBy: attachment.uploadedBy,
          uploadedAt: attachment.uploadedAt,
        })),
        files: defaultValue.files,
      });
    }
  }, [query.data, isEdit, isCreate]);

  return (
    <Form {...form}>
      <DashboardFormWrapper
        onSubmit={form.handleSubmit((input) => mutation.mutate(input))}
        className="max-w-screen-2xl"
      >
        <div className="flex items-center gap-3 mb-5 justify-between">
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
                    : query.data
                    ? `${query.data.code}: ${query.data.name}`
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
              Customer not found
            </h2>
          </>
        ) : (
          <Tabs
            defaultValue="information"
            value={tab}
            onValueChange={(value) => setTab(value as typeof tab)}
          >
            <TabsList className="bg-transparent p-0 h-fit">
              <TabsTrigger
                value="information"
                className={cn(
                  tabTriggerClassName,
                  errorTabs.information && tabTriggerInvalidClassName
                )}
              >
                Information
              </TabsTrigger>
              <TabsTrigger
                value="bankAccounts"
                className={cn(
                  tabTriggerClassName,
                  errorTabs.bankAccounts && tabTriggerInvalidClassName
                )}
              >
                Bank Accounts
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className={cn(
                  tabTriggerClassName,
                  errorTabs.contacts && tabTriggerInvalidClassName
                )}
              >
                Contact Persons
              </TabsTrigger>

              <TabsTrigger
                value="notes"
                className={cn(
                  tabTriggerClassName,
                  errorTabs.notes && tabTriggerInvalidClassName
                )}
              >
                Notes
              </TabsTrigger>
              <TabsTrigger
                value="attachments"
                className={cn(
                  tabTriggerClassName,
                  errorTabs.attachments && tabTriggerInvalidClassName
                )}
              >
                Attachments
              </TabsTrigger>
            </TabsList>
            <InfomationTab
              tabContentClassName={tabContentClassName}
              form={form}
              customerId={customerId}
              isCreate={isCreate}
              defaultValue={defaultValue}
              setDisable={setIsDisabled}
            />
            <BankAccountsTab
              tabContentClassName={tabContentClassName}
              form={form}
              isCreate={isCreate}
              isEdit={isEdit}
              setTab={setTab}
            />
            <ContactPersonsTab
              tabContentClassName={tabContentClassName}
              form={form}
              isCreate={isCreate}
              isEdit={isEdit}
              setTab={setTab}
            />
            <NoteTab tabContentClassName={tabContentClassName} form={form} />
            <AttachementsTab
              tabContentClassName={tabContentClassName}
              form={form}
              customerId={customerId}
              isCreate={isCreate}
              isEdit={isEdit}
            />
          </Tabs>
        )}
      </DashboardFormWrapper>
    </Form>
  );
}
