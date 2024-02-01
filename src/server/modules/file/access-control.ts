import { z } from "zod";

export const accessControlSchema = z.discriminatedUnion("rule", [
  z.object({
    rule: z.literal("public"),
  }),
  z.object({
    rule: z.literal("userId"),
    userId: z.string().nullish(),
  }),
]);

export type TAccessControl = z.infer<typeof accessControlSchema>;
