import { productTypeEnum, vatTypeEnum } from "@/db/schema/product";

export type ProductType = (typeof productTypeEnum.enumValues)[number];

export const PRODUCT_TYPE: Record<
  ProductType,
  {
    label: string;
  }
> = {
  stock: {
    label: "Stock",
  },
  service: {
    label: "Service",
  },
};

export type VatType = (typeof vatTypeEnum.enumValues)[number];

export const VAT_TYPE: Record<
  VatType,
  {
    label: string;
  }
> = {
  include: {
    label: "Include",
  },
  exclude: {
    label: "Exclude",
  },
  exempt: {
    label: "Exempt",
  },
};
