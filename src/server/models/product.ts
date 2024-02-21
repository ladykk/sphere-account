import { z } from "zod";
import { paginateInputSchema, paginateOutputSchema } from ".";
import { productTypeEnum, products, vatTypeEnum } from "@/db/schema/product";
import db from "@/db";
import { and, eq, not } from "drizzle-orm";

const baseOutput = z.object({
  id: z.string().uuid("Invalid Employee ID"),
  type: z.enum(productTypeEnum.enumValues),
  name: z.string().min(1, "Name required"),
  code: z.string().min(1, "Code required"),
  category: z.string().min(1, "Category required"),
  barcode: z
    .string()
    .refine(async (value) => {
      // Length not set
      if (value.length === 0) return true;
      // Length must be 10
      if (value.length !== 10) return false;
      // All characters must be digits
      return /^\d+$/.test(value);
    }, "Barcode must be 10 digits")
    .nullable(),
  sellingPrice: z
    .string()
    .min(1, "Selling price required")
    .transform((arg) => Number(arg)),
  vatType: z.enum(vatTypeEnum.enumValues).default("include"),
  description: z.string().nullable(),
  stock: z.number().default(0),
  unit: z.string().min(1, "Unit required"),
  image: z.string().nullable().default(null),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  createdBy: z.string().nullable(),
  updatedAt: z.date(),
  updatedBy: z.string().nullable(),
});

const checkDuplicateCode = async (code: string, id?: string) => {
  // Check duplicate code
  const result = await db
    .select({
      id: products.id,
    })
    .from(products)
    .where(
      and(eq(products.code, code), id ? not(eq(products.id, id)) : undefined)
    )
    .limit(1);

  return result.length > 0;
};

const checkDuplicateBarcode = async (barcode: string, id?: string) => {
  // Check duplicate barcode
  const result = await db
    .select({
      id: products.id,
    })
    .from(products)
    .where(
      and(
        eq(products.barcode, barcode),
        id ? not(eq(products.id, id)) : undefined
      )
    )
    .limit(1);

  return result.length > 0;
};

const formInput = baseOutput
  .omit({
    id: true,
    stock: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
  })
  .extend({
    id: baseOutput.shape.id.optional(),
  })
  .superRefine(async (val, ctx) => {
    // Check duplicate code
    if (await checkDuplicateCode(val.code, val.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Code already exists",
        path: ["code"],
      });
    }
    // Check duplicate barcode
    if (val.barcode && (await checkDuplicateBarcode(val.barcode, val.id))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Barcode already exists",
        path: ["barcode"],
      });
    }
  });

export const Product = {
  schemas: {
    id: baseOutput.shape.id,
    baseOutput,
    paginateInput: paginateInputSchema({
      keyword: z.string().optional(),
      category: z
        .string()
        .transform((arg) => arg.split(","))
        .optional(),
      type: z
        .string()
        .transform((arg) =>
          arg.split(",").map((value) => baseOutput.shape.type.parse(value))
        )
        .optional(),
    }),
    paginateOutput: paginateOutputSchema(baseOutput),
    formInput,
  },
};
