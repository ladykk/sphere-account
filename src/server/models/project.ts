import { z } from "zod";
import { paginateInputSchema, paginateOutputSchema } from ".";

export const baseOutput = z.object({
  id: z.string().uuid("Invalid uuid"),
  name: z.string().min(1, "Project's name required"),
  // TODO: Add customer field
  customerId: z.string().min(1, "Customer Required").uuid("Invalid uuid"),
  detail: z.string().nullable().default(""),
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

export const Project = {
  schemas: {
    baseOutput,
    paginateInput: paginateInputSchema({
      keyword: z.string().optional(),
      customerId: z.string().uuid("Invalid uuid").optional(),
    }),
    paginateOutput: paginateOutputSchema(baseOutput),
    formInput,
  },
};
