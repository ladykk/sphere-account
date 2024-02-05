import { z } from "zod"

export const Project = {
    schemas: {
        base: z.object({
            id: z.string().min(1, "Require project's id").uuid("Invalid uuid"),
            name: z.string().min(1, "Require project's name"),
            customerId: z.string().min(1, "Require customerId").uuid("Invalid uuid"),
            detail: z.string().nullable().default(""),
            createdAt: z.date(),
            createdBy: z.string().nullable(),
            updatedAt: z.date(),
            updatedBy: z.string().nullable(),
        }),

        createOutputSchema: z.object({
            id: z.string()
        })
    }
}