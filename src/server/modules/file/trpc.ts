import { TContext, protectedProcedure, publicProcedure } from "@/server/trpc";
import { TAccessControl } from "./access-control";
import { z } from "zod";
import { files } from "@/db/schema/file";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";

export const generatePresignedUrlInputSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
});

export const generatePresignedUrlOutputSchema = z.string();

export const generatePresignedUrlProcedure = (
  config: (ctx: TContext) => {
    readAccessControl: TAccessControl;
    writeAccessControl: TAccessControl;
    isRequireAuth: boolean;
  }
) =>
  publicProcedure
    .input(z.array(generatePresignedUrlInputSchema))
    .output(z.array(generatePresignedUrlOutputSchema))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.transaction(async (trx) => {
        const configuration = config(ctx);
        // Check if user is authenticated
        if (configuration.isRequireAuth && !ctx.session)
          throw new TRPCError({
            code: "UNAUTHORIZED",
          });

        // Get current date
        const currentDate = new Date();

        // Prepare values
        const values = input.map((file) => ({
          id: `${crypto.randomUUID()}-${currentDate.toISOString()}.${file.fileName
            .split(".")
            .pop()}`,
          fileName: file.fileName,
          fileType: file.fileType,
          fileSize: file.fileSize,
          issuedAt: currentDate,
          expiredAt: new Date(currentDate.getTime() + 86400000), // 24 hours
          issuedBy: ctx.session?.user.id,
          readAccessControl: configuration.readAccessControl,
          writeAccessControl: configuration.writeAccessControl,
        }));

        // Insert values
        const filesResult = await trx.insert(files).values(values).returning({
          id: files.id,
        });

        // Force Commit
        await trx.execute(sql`COMMIT;`);

        return filesResult.map((file) => file.id);
      });
    });
