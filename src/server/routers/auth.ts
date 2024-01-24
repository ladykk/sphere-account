import { userCredentials, users } from "@/db/schema/auth";
import { Auth } from "../models/auth";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(Auth.schemas.registerInputSchema)
    .output(Auth.schemas.registerOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.transaction(async (trx) => {
        // Create user
        const userResult = await trx
          .insert(users)
          .values({
            id: crypto.randomUUID(),
            name: `${input.firstName} ${input.lastName}`,
            email: input.email,
          })
          .returning({
            id: users.id,
          });

        // Throw error if userResult is empty
        if (userResult.length === 0)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
          });

        // Create user credentials
        const userCredentialResult = await trx
          .insert(userCredentials)
          .values({
            userId: userResult[0].id,
            password: await Auth.logics.hashPassword(input.password),
          })
          .returning({
            userId: userCredentials.userId,
          });

        // Throw error if userCredentialResult is empty
        if (userCredentialResult.length === 0)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
          });

        // Return email
        return {
          email: input.email,
        };
      });
    }),
});
