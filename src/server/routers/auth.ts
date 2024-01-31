import {
  accounts,
  resetPasswordTokens,
  userCredentials,
  users,
} from "@/db/schema/auth";
import { Auth } from "../models/auth";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { and, eq, gt, lt } from "drizzle-orm";
import { sendMail } from "../modules/email";
import ResetPasswordEmail from "@/emails/ResetPasswordEmail";
import { env } from "@/env/server.mjs";
import { getBaseUrl } from "@/trpc/shared";
import { generatePresignedUrlProcedure } from "../modules/file/trpc";
import { deleteFileByUrl } from "../modules/file";

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
  sendResetPasswordEmail: publicProcedure
    .input(Auth.schemas.sendResetPasswordEmailInputSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.transaction(async (trx) => {
        const userResult = await trx
          .select({ id: users.id, name: users.name })
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        // Skip if userResult is empty
        if (userResult.length === 0) return;

        // Create reset password token
        const resetPasswordTokensResult = await trx
          .insert(resetPasswordTokens)
          .values({
            token: crypto.randomUUID(),
            userId: userResult[0].id,
            expires: new Date(
              Date.now() + Auth.constants.RESET_PASSWORD_TOKEN_EXPIRY
            ), // 1 Hour
          })
          .returning({
            token: resetPasswordTokens.token,
          });

        // Throw error if resetPasswordTokensResult is empty

        if (resetPasswordTokensResult.length === 0)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create reset password token",
          });

        // Send email
        await sendMail(
          input.email,
          "SphereAccount reset password",
          ResetPasswordEmail({
            name: userResult[0].name ?? "User",
            expiresDuration: Auth.constants.RESET_PASSWORD_TOKEN_EXPIRY_TEXT,
            resetPasswordLink: `${getBaseUrl()}/auth/reset-password?token=${
              resetPasswordTokensResult[0].token
            }`,
            contactEmail: env.SMTP_USERNAME,
          })
        ).catch((err) => {
          console.error(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send email",
          });
        });
      });
    }),
  getResetPasswordTokenExpire: publicProcedure
    .input(Auth.schemas.getResetPasswordTokenExpireInputSchema)
    .output(Auth.schemas.getResetPasswordTokenExpireOutputSchema)
    .query(async ({ input, ctx }) => {
      return ctx.db.transaction(async (trx) => {
        // Return false if has no token
        if (!input) return false;

        // Find token from database
        const result = await trx
          .select({
            token: resetPasswordTokens.token,
          })
          .from(resetPasswordTokens)

          .where(
            and(
              eq(resetPasswordTokens.token, input),
              eq(resetPasswordTokens.isUsed, false),
              gt(resetPasswordTokens.expires, new Date())
            )
          )
          .limit(1);

        return result.length > 0;
      });
    }),
  resetPassword: publicProcedure
    .input(Auth.schemas.resetPasswordInputSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.transaction(async (trx) => {
        // Find token from database
        const result = await trx
          .select({
            token: resetPasswordTokens.token,
            userId: resetPasswordTokens.userId,
          })
          .from(resetPasswordTokens)
          .where(
            and(
              eq(resetPasswordTokens.token, input.token),
              eq(resetPasswordTokens.isUsed, false),
              gt(resetPasswordTokens.expires, new Date())
            )
          )
          .limit(1);

        // Throw error if result is empty
        if (result.length === 0)
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Invalid token",
          });

        // Update token to used
        await trx
          .update(resetPasswordTokens)
          .set({
            isUsed: true,
          })
          .where(eq(resetPasswordTokens.token, input.token));

        // Update password
        const newPassword = await Auth.logics.hashPassword(input.password);
        await trx
          .insert(userCredentials)
          .values({
            userId: result[0].userId,
            password: newPassword,
          })
          .onConflictDoUpdate({
            target: userCredentials.userId,
            set: {
              password: newPassword,
            },
          });
      });
    }),
  getAccountLoginOptions: protectedProcedure
    .output(Auth.schemas.getAccountLoginOptionsOutputSchema)
    .query(async ({ ctx }) => {
      return ctx.db.transaction(async (trx) => {
        const accountResults = await trx
          .select({
            provider: accounts.provider,
          })
          .from(accounts)
          .where(eq(accounts.userId, ctx.session.user.id));

        const userCredentialResult = await trx
          .select({
            userId: userCredentials.userId,
          })
          .from(userCredentials)
          .where(eq(userCredentials.userId, ctx.session.user.id))
          .limit(1);

        return {
          password: userCredentialResult.length > 0,
          google: accountResults.some(
            (account) => account.provider === "google"
          ),
          facebook: accountResults.some(
            (account) => account.provider === "facebook"
          ),
          line: accountResults.some((account) => account.provider === "line"),
        };
      });
    }),
  generateImagePresignedUrl: generatePresignedUrlProcedure((ctx) => ({
    readAccessControl: {
      rule: "public",
    },
    writeAccessControl: {
      rule: "userId",
      userId: ctx.session?.user.id,
    },
    isRequireAuth: true,
  })),
  updateAccount: protectedProcedure
    .input(Auth.schemas.updateAccountInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (trx) => {
        const allowChangeEmail = !ctx.session.user.email;

        if (input.image !== ctx.session.user.image)
          await deleteFileByUrl(ctx.session.user.image ?? "");

        await trx
          .update(users)
          .set({
            name: `${input.firstName} ${input.lastName}`,
            email: allowChangeEmail
              ? input.email
              : ctx.session.user.email ?? undefined,
            image: input.image,
          })
          .where(eq(users.id, ctx.session.user.id));
      });
    }),
});
