import { Project } from "../models/project";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { and, eq, like, sql } from "drizzle-orm";
import { projects } from "@/db/schema/project";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  getProject: protectedProcedure
    .input(z.string().uuid("Invalid uuid"))
    .output(Project.schemas.baseOutput)
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction(async (trx) => {
        const result = await trx
          .select({
            id: projects.id,
            code: projects.code,
            name: projects.name,
            customerId: projects.customerId,
            detail: projects.detail,
            isActive: projects.isActive,
            createdAt: projects.createdAt,
            createdBy: projects.createdBy,
            updatedAt: projects.updatedAt,
            updatedBy: projects.updatedBy,
          })
          .from(projects)
          .where(and(eq(projects.id, input)))
          .limit(1);

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        console.log(result[0]);

        return result[0];
      });
    }),
  getProjects: protectedProcedure
    .output(z.array(Project.schemas.baseOutput))
    .query(async ({ ctx }) => {
      return ctx.db.transaction(async (trx) => {
        const result = await trx
          .select({
            id: projects.id,
            code: projects.code,
            name: projects.name,
            customerId: projects.customerId,
            detail: projects.detail,
            isActive: projects.isActive,
            createdAt: projects.createdAt,
            createdBy: projects.createdBy,
            updatedAt: projects.updatedAt,
            updatedBy: projects.updatedBy,
          })
          .from(projects);

        return result;
      });
    }),
  getPaginateProjects: protectedProcedure
    .input(Project.schemas.paginateInput)
    .output(Project.schemas.paginateOutput)
    .query(async ({ ctx, input }) => {
      const { page, itemsPerPage, ...filters } = input;

      // Filters
      const whereClause = and(
        filters.keyword // Filter: Keyword
          ? like(projects.name, `%${filters.keyword}%`)
          : undefined,
        filters.customerId // Filter: Customer
          ? eq(projects.customerId, filters.customerId)
          : undefined
      );

      const count = await ctx.db
        .select({
          count: sql<number>`CAST(COUNT(*) AS INT)`,
        })
        .from(projects)
        .where(whereClause);

      const list = await ctx.db
        .select({
          id: projects.id,
          code: projects.code,
          name: projects.name,
          customerId: projects.customerId,
          detail: projects.detail,
          isActive: projects.isActive,
          createdAt: projects.createdAt,
          createdBy: projects.createdBy,
          updatedAt: projects.updatedAt,
          updatedBy: projects.updatedBy,
        })
        .from(projects)
        .where(whereClause)
        .limit(itemsPerPage)
        .offset((page - 1) * itemsPerPage);

      return {
        count: count[0].count,
        list,
        currentPage: page,
        totalPage: Math.ceil(count[0].count / itemsPerPage),
      };
    }),
  createOrUpdateProject: protectedProcedure
    .input(Project.schemas.formInput)
    .output(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (trx) => {
        // CASE: Create
        if (!input.id) {
          const result = await trx
            .insert(projects)
            .values({
              id: crypto.randomUUID(),
              code: input.code,
              name: input.name,
              customerId: input.customerId,
              detail: input.detail,
              isActive: input.isActive,
              createdBy: ctx.session.user.id,
              updatedBy: ctx.session.user.id,
            })
            .returning({
              id: projects.id,
            });

          return result[0].id;
        }
        // CASE: Update
        else {
          // Find project
          const project = await trx
            .select({
              id: projects.id,
            })
            .from(projects)
            .where(and(eq(projects.id, input.id)))
            .limit(1);

          // Check if project exists
          if (project.length === 0) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Project not found",
            });
          }

          // Update project
          await trx
            .update(projects)
            .set({
              code: input.code,
              name: input.name,
              customerId: input.customerId,
              detail: input.detail,
              isActive: input.isActive,
              updatedAt: new Date(),
              updatedBy: ctx.session.user.id,
            })
            .where(eq(projects.id, input.id));

          return input.id;
        }
      });
    }),
});
