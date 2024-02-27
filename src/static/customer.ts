import { contactTypeEnum, customerAttachmentType } from "@/db/schema/customer";

export type CustomerType = (typeof contactTypeEnum.enumValues)[number];

export const CUSTOMER_TYPE: Record<
  CustomerType,
  {
    label: string;
  }
> = {
  person: {
    label: "Person",
  },
  coperate: {
    label: "Coperate",
  },
};

export type customerAttachmentType =
  (typeof customerAttachmentType.enumValues)[number];

export const CUSTOMER_ATTACHMENT_TYPE: Record<
  customerAttachmentType,
  {
    label: string;
  }
> = {
  infomation: {
    label: "Information",
  },
  bankAccounts: {
    label: "Bank Accounts",
  },
  contactPersons: {
    label: "Contact Persons",
  },
  notes: {
    label: "Notes",
  },
};
