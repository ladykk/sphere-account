import { z } from "zod";
import { paginateInputSchema, paginateOutputSchema } from ".";

export const baseOutput = z.object({
  id: z.string().min(1, "Project ID is required").uuid("Invalid Project ID"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name required"),
  customerId: z
    .string()
    .min(1, "Customer is Required")
    .uuid("Invalid Customer ID"),
  detail: z.string().nullable().default(null),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  createdBy: z.string().nullable().default(null),
  updatedAt: z.date(),
  updatedBy: z.string().nullable().default(null),
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
    id: baseOutput.shape.id.optional(),
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
