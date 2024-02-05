import { z } from "zod"
import { paginateInputSchema, paginateOutputSchema } from ".";

export const baseOutput = z.object({
    id: z.string().uuid("Invalid uuid"),
    type: z.string().min(1, "Require product's type"),
    name: z.string().min(1, "Require product's name"),
    code: z.string().min(1, "Require product's code"),
    category: z.string().nullable().default(""),
    barcode: z.string().nullable().default(""),
    sellingPrice: z.string().min(1, "Require product's selling price").transform((arg) => Number(arg)),
    vatType: z.string().nullable().default(""),
    description: z.string().nullable().default(""),
    quantity: z.number().nullable().default(0),
    unit: z.string().min(1, "Require product's unit"),
    createdAt: z.date(),
    createdBy: z.string().nullable(),
    updatedAt: z.date(),
    updatedBy: z.string().nullable(),
});

export const formInput = baseOutput
    .omit({
        id: true,
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
        baseOutput,
        paginateInput: paginateInputSchema({
            keyword: z.string().optional(),
        }),
        paginateOutput: paginateOutputSchema(baseOutput),
        formInput,
    },
};