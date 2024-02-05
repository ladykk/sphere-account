import { Project } from "../models/project";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod"
import { eq } from "drizzle-orm"
import { projects } from "@/db/schema/project";
import { TRPCError } from "@trpc/server";


export const productRouter = createTRPCRouter({
    //Get Project
    getProject: protectedProcedure
        .input(z.string().uuid("Invalid uuid"))
        .output(Project.schemas.base)
        .query(async ({ ctx, input }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select()
                    .from(projects)
                    .where(
                        eq(projects.id, input)
                    )
                    .limit(1)
                return result[0];
            });

        }),

    //Get Projects
    getProjects: protectedProcedure
        .output(z.array(Project.schemas.base))
        .query(async ({ ctx }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select()
                    .from(projects)
                return result;
            });
        }),

    createProject: protectedProcedure
        .input(Project.schemas.base)
        .output(Project.schemas.createOutputSchema)
        .mutation(async ({ input, ctx }) => {
            return await ctx.db.transaction(async (trx) => {
                //Create project
                const createResult = await trx
                    .insert(projects)
                    .values({
                        id: input.id,
                        name: input.name,
                        customerId: input.customerId,
                        detail: input.detail,
                        createdAt: new Date(Date.now()),
                        createdBy: input.createdBy,
                        updatedAt: new Date(Date.now()),
                        updatedBy: input.updatedBy,
                    })  
                    .returning({
                        id: projects.id,
                    });

                // Throw error if createResult is empty
                if (createResult.length === 0)
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create user",
                    });

                return { id: createResult[0].id };
            });
        }),

})

