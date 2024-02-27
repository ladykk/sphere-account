import { customerAttachmentType } from "@/static/customer";
import { RouterInputs } from "@/trpc/shared";
import { DefaultValues } from "react-hook-form";

export type CustomerTab =
  | "information"
  | "bankAccounts"
  | "contacts"
  | "attachments"
  | "notes";

export type FormInput = RouterInputs["customer"]["createOrUpdateCustomer"] & {
  files: {
    attachements: Array<{
      file: File;
      fileCategory: customerAttachmentType;
    }>;
  };
};

export const defaultBankAccount: FormInput["bankAccounts"][0] = {
  id: undefined,
  accountNumber: "",
  bank: "",
  bankBranch: "",
  accountType: "",
  isActive: true,
};

export const defaultContact: FormInput["contacts"][0] = {
  id: undefined,
  contactName: "",
  phoneNumber: "",
  email: "",
  isActive: true,
};

export const defaultValue: DefaultValues<FormInput> = {
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
  creditDate: null,
  notes: "",
  isActive: true,
  contacts: [defaultContact],
  bankAccounts: [defaultBankAccount],
  attachments: [],
  files: {
    attachements: [],
  },
};

export const tabTriggerClassName =
  "data-[state=active]:bg-orange-500 rounded-t-lg bg-gray-400 text-white pl-6 pt-3 pb-3 pr-6 rounded-b-none data-[state=active]:text-white w-36";
export const tabTriggerInvalidClassName =
  "data-[state=inactive]:animate-pulse data-[state=inactive]:bg-destructive";
export const tabContentClassName =
  "p-6 shadow-lg rounded-b-lg bg-white mt-0 rounded-tr-lg border";
