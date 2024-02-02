import { z } from "zod";
import { paginateInputSchema, paginateOutputSchema } from ".";

export const base = z.object({
  id: z.string().uuid("Invalid uuid"),
  name: z.string().min(1, "Project's name required"),
  customerId: z.string().min(1, "Customer Required").uuid("Invalid uuid"),
  detail: z.string().nullable().default(""),
  createdAt: z.date(),
  createdBy: z.string().nullable(),
  updatedAt: z.date(),
  updatedBy: z.string().nullable(),
});

export const Project = {
  schemas: {
    base: base,
    paginateInput: paginateInputSchema({
      keyword: z.string().optional(),
      customerId: z.string().uuid("Invalid uuid").optional(),
    }),
    paginateOutput: paginateOutputSchema(base),
  },
};
