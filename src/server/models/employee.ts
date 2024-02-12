import { z } from "zod";
import { paginateInputSchema, paginateOutputSchema } from ".";

const id = z
  .string({
    required_error: "Employee's id required",
  })
  .uuid("Invalid uuid");

const baseOutput = z.object({
  id: id,
  saleNo: z.string().default(""),
  name: z.string().min(1, "Employee's name required"),
  email: z.string().email().nullable().default(null),
  phoneNumber: z.string().nullable().default(null),
  image: z.string().url().nullable().default(null),
  createdAt: z.date(),
  createdBy: z.string().nullable().default(null),
  updatedAt: z.date(),
  updatedBy: z.string().nullable().default(null),
});

const formInput = baseOutput
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
  })
  .extend({
    id: id.optional(),
  });

export const Employee = {
  schemas: {
    id,
    baseOutput,
    paginatedInput: paginateInputSchema({
      keyword: z.string().optional(),
    }),
    paginatedOutput: paginateOutputSchema(baseOutput),
    formInput,
  },
};
