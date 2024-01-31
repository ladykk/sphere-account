import { z } from "zod"

export const Product = {
    schemas: {
        base: z.object({
            id: z.string().min(1, "Require product's id").uuid("Invalid uuid"),
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
        }),

        createOutputSchemas: z.object({
            id: z.string()
        })
    }
}