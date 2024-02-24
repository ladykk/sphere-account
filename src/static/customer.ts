import { contactTypeEnum } from "@/db/schema/customer";

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
