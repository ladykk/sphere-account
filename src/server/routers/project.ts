import { Project } from "../models/project";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod"
import { eq } from "drizzle-orm"
import { projects } from "@/db/schema/project";


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
})



//CreateOrUpdate Product
// return Product.schemas.base.parse(input)