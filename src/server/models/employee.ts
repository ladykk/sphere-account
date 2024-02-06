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
  email: z.string().email().nullable(),
  phoneNumber: z.string().nullable(),
  image: z.string().url().nullable(),
  createdAt: z.date(),
  createdBy: z.string().nullable(),
  updatedAt: z.date(),
  updatedBy: z.string().nullable(),
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
