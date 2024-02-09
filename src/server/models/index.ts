import { ZodRawShape, z } from "zod";

export const paginateInputSchema = <T extends ZodRawShape>(schema: T) =>
  z.object({
    page: z.number().default(1),
    itemsPerPage: z.number().default(10),
    ...schema,
  });

export const paginateOutputSchema = <T extends ZodRawShape>(
  schema: z.ZodObject<T>
) =>
  z.object({
    count: z.number(),
    list: z.array(schema),
    currentPage: z.number(),
    totalPage: z.number(),
  });
