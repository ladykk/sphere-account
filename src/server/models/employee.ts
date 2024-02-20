import { z } from "zod";
import { paginateInputSchema, paginateOutputSchema } from ".";
import db from "@/db";
import { employees } from "@/db/schema/employee";
import { and, eq, not } from "drizzle-orm";

const ID = z
  .string({
    required_error: "Employee ID is required",
  })
  .min(1, "Employee ID is required")
  .uuid("Invalid Employee ID");

const baseOutput = z.object({
  id: ID,
  code: z
    .string({
      required_error: "Code is required",
    })
    .min(1, "Code is required"),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name is required"),
  email: z.string().email("Invalid Email").nullable().default(null),
  phoneNumber: z.string().nullable().default(null),
  image: z.string().nullable().default(null),
  isActive: z.boolean().default(true),
  createdAt: z.date({
    required_error: "Created At is required",
  }),
  createdBy: z.string().nullable().default(null),
  updatedAt: z.date({
    required_error: "Updated At is required",
  }),
  updatedBy: z.string().nullable().default(null),
});

const checkDuplicateCode = async (code: string, id?: string) => {
  // Check duplicate code
  const result = await db
    .select({
      id: employees.id,
    })
    .from(employees)
    .where(
      and(eq(employees.code, code), id ? not(eq(employees.id, id)) : undefined)
    )
    .limit(1);

  return result.length > 0;
};

const formInput = baseOutput
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
  })
  .extend({
    id: ID.optional(),
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
  });

export const Employee = {
  schemas: {
    id: ID,
    baseOutput,
    paginatedInput: paginateInputSchema({
      keyword: z.string().optional(),
    }),
    paginatedOutput: paginateOutputSchema(baseOutput),
    formInput,
  },
};
