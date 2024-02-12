import { z } from "zod";
import { paginateInputSchema, paginateOutputSchema } from ".";

export const category = z.string().default("");

export const unit = z.string().default("");

const id = z
  .string({
    required_error: "Employee's id required",
  })
  .uuid("Invalid uuid");

const baseOutput = z.object({
  id: id,
  type: z.string().min(1, "Require product's type"),
  name: z.string().min(1, "Require product's name"),
  code: z.string().min(1, "Require product's code"),
  category: category,
  barcode: z.string().nullable().default(""),
  sellingPrice: z
    .string()
    .min(1, "Require product's selling price")
    .transform((arg) => Number(arg)),
  vatType: z.string().nullable().default(""),
  description: z.string().nullable().default(""),
  unit: unit,
  stock: z.number().default(0),
    image: z.string().url().nullable().default(null),
  createdAt: z.date(),
  createdBy: z.string().nullable(),
  updatedAt: z.date(),
  updatedBy: z.string().nullable(),
});

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
    id: z.string().uuid("Invalid uuid").optional(),
  });

export const Product = {
  schemas: {
        id,
    baseOutput,
    paginateInput: paginateInputSchema({
      keyword: z.string().optional(),
      category: z.string().optional(),
      type: z.string().optional(),
    }),
    paginateOutput: paginateOutputSchema(baseOutput),
    formInput,
  },
};
