import db from "@/db";
import { userCredentials, users } from "@/db/schema/auth";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getServerAuthSession } from "../modules/auth/server";

export const Auth = {
  constants: {
    RESET_PASSWORD_TOKEN_EXPIRY: 1000 * 60 * 60, // 1 hour
    RESET_PASSWORD_TOKEN_EXPIRY_TEXT: "1 hour",
  },
  logics: {
    checkEmailExists: async (email: string) => {
      const result = await db
        .select({
          count: sql<number>`CAST(COUNT(${users.id}) AS INTEGER)`,
        })
        .from(users)
        .where(eq(users.email, email));
      return result[0].count > 0;
    },
    hashPassword: async (password: string) => {
      return await bcrypt.hash(password, 10);
    },
  },
  schemas: {
    registerInputSchema: z
      .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z
          .string()
          .email("Invalid email address")
          .min(1, "Email is required"),
        password: z
          .string()
          .min(6, "Password's length should be between 6-20")
          .max(20, "Password's length should be between 6-20"),
        confirmPassword: z
          .string()
          .min(6, "Password's length should be between 6-20")
          .max(20, "Password's length should be between 6-20"),
      })
      .superRefine(async (val, ctx) => {
        if (val.password !== val.confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirmPassword"],
          });
        }

        if (await Auth.logics.checkEmailExists(val.email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email already exists",
            path: ["email"],
          });
        }
      }),
    registerOutputSchema: z.object({
      email: z.string(),
    }),
    sendResetPasswordEmailInputSchema: z
      .object({
        email: z
          .string()
          .email("Invalid email address")
          .min(1, "Email is required"),
      })
      .superRefine(async (val, ctx) => {
        if (!(await Auth.logics.checkEmailExists(val.email))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email does not exist",
            path: ["email"],
          });
        }
      }),
    getResetPasswordTokenExpireInputSchema: z.string().optional(),
    getResetPasswordTokenExpireOutputSchema: z.boolean().default(false),
    resetPasswordInputSchema: z
      .object({
        token: z.string().min(1, "Token is required"),
        password: z
          .string()
          .min(6, "Password's length should be between 6-20")
          .max(20, "Password's length should be between 6-20"),
        confirmPassword: z
          .string()
          .min(6, "Password's length should be between 6-20")
          .max(20, "Password's length should be between 6-20"),
      })
      .superRefine(async (val, ctx) => {
        if (val.password !== val.confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirmPassword"],
          });
        }
      }),
    getAccountLoginOptionsOutputSchema: z.object({
      password: z.boolean().default(false),
      facebook: z.boolean().default(false),
      google: z.boolean().default(false),
      line: z.boolean().default(false),
    }),
    updateAccountInputSchema: z
      .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z
          .string()
          .email("Invalid email address")
          .min(1, "Email is required"),
        image: z.string().optional(),
      })
      .superRefine(async (val, ctx) => {
        const session = await getServerAuthSession();
        if (
          session?.user.email !== val.email &&
          (await Auth.logics.checkEmailExists(val.email))
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email already exists",
            path: ["email"],
          });
        }
      }),
    unlinkLoginProviderInputSchema: z.string(),
    registerPasswordInputSchema: z
      .object({
        oldPassword: z.string(),
        newPassword: z
          .string()
          .min(6, "Password's length should be between 6-20")
          .max(20, "Password's length should be between 6-20"),
        confirmNewPassword: z
          .string()
          .min(6, "Password's length should be between 6-20")
          .max(20, "Password's length should be between 6-20"),
      })
      .superRefine(async (val, ctx) => {
        const session = await getServerAuthSession();

        if (!session?.user.email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "User not found",
            path: ["oldPassword"],
          });
          return;
        }

        const userCredentialsResult = await db
          .select({
            password: userCredentials.password,
          })
          .from(userCredentials)
          .where(eq(userCredentials.userId, session?.user.id ?? ""))
          .limit(1);

        // Case: User has password
        if (userCredentialsResult.length > 0) {
          const password = z
            .string()
            .min(6, "Password's length should be between 6-20")
            .max(20, "Password's length should be between 6-20")
            .safeParse(val.oldPassword);

          // Case: Invalid old password
          if (!password.success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Invalid old password",
              path: ["oldPassword"],
            });
            return;
          }

          // Case: Old password is incorrect
          if (
            !(await bcrypt.compare(
              val.oldPassword,
              userCredentialsResult[0].password
            ))
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Old password is incorrect",
              path: ["oldPassword"],
            });
          }
        }

        if (val.newPassword !== val.confirmNewPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirmNewPassword"],
          });
        }
      }),
  },
};
