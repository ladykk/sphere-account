import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Employee } from "../models/employee";
import { employees } from "@/db/schema/employee";
import { eq, and, like, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  deleteFileById,
  deleteFileByUrl,
  getIdFromUrl,
  getUrlById,
} from "../modules/file";
import { generatePresignedUrlProcedure } from "../modules/file/trpc";

export const employeeRouter = createTRPCRouter({
  getEmployee: protectedProcedure
    .input(z.string().uuid("Invalid uuid"))
    .output(Employee.schemas.baseOutput)
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction(async (trx) => {
        const result = await trx
          .select({
            id: employees.id,
            saleNo: employees.saleNo,
            name: employees.name,
            email: employees.email,
            phoneNumber: employees.phoneNumber,
            image: employees.image,
            createdAt: employees.createdAt,
            createdBy: employees.createdBy,
            updatedAt: employees.updatedAt,
            updatedBy: employees.updatedBy,
          })
          .from(employees)
          .where(
            and(
              eq(employees.id, input),
              eq(employees.createdBy, ctx.session.user.id)
            )
          )
          .limit(1);

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Employee not found",
          });
        }

        return {
          ...result[0],
          image: result[0].image ? getUrlById(result[0].image) : null,
        };
      });
    }),
  getEmployees: protectedProcedure
    .output(z.array(Employee.schemas.baseOutput))
    .query(async ({ ctx }) => {
      return ctx.db.transaction(async (trx) => {
        const result = await trx
          .select({
            id: employees.id,
            saleNo: employees.saleNo,
            name: employees.name,
            email: employees.email,
            phoneNumber: employees.phoneNumber,
            image: employees.image,
            createdAt: employees.createdAt,
            createdBy: employees.createdBy,
            updatedAt: employees.updatedAt,
            updatedBy: employees.updatedBy,
          })
          .from(employees)
          .where(eq(employees.createdBy, ctx.session.user.id));
        return result.map((r) => ({
          ...r,
          image: r.image ? getUrlById(r.image) : null,
        }));
      });
    }),
  getPaginateEmployees: protectedProcedure
    .input(Employee.schemas.paginatedInput)
    .output(Employee.schemas.paginatedOutput)
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction(async (trx) => {
        const { page, itemsPerPage, ...filters } = input;

        const whereClause = and(
          eq(employees.createdBy, ctx.session.user.id),
          // Filter: Keyword
          filters.keyword
            ? like(employees.name, `%${filters.keyword}%`)
            : undefined
        );

        const count = await trx
          .select({
            count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
          })
          .from(employees)
          .where(whereClause)
          .limit(1);

        const list = await trx
          .select({
            id: employees.id,
            saleNo: employees.saleNo,
            name: employees.name,
            email: employees.email,
            phoneNumber: employees.phoneNumber,
            image: employees.image,
            createdAt: employees.createdAt,
            createdBy: employees.createdBy,
            updatedAt: employees.updatedAt,
            updatedBy: employees.updatedBy,
          })
          .from(employees)
          .where(whereClause)
          .offset((page - 1) * itemsPerPage)
          .limit(itemsPerPage);

        return {
          count: count[0].count,
          list: list.map((r) => ({
            ...r,
            image: r.image ? getUrlById(r.image) : null,
          })),
          currentPage: page,
          totalPage: Math.ceil(count[0].count / itemsPerPage),
        };
      });
    }),
  createOrUpdateEmployee: protectedProcedure
    .input(Employee.schemas.formInput)
    .output(Employee.schemas.id)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (trx) => {
        // CASE: Update
        if (input.id) {
          const oldData = await trx
            .select({
              id: employees.id,
              image: employees.image,
            })
            .from(employees)
            .where(
              and(
                eq(employees.id, input.id),
                eq(employees.createdBy, ctx.session.user.id)
              )
            )
            .limit(1);

          if (oldData.length === 0) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Employee not found",
            });
          }

          if (
            oldData[0].image &&
            oldData[0].image !== getIdFromUrl(input.image)
          ) {
            await deleteFileById(oldData[0].image);
          }

          await trx
            .update(employees)
            .set({
              saleNo: input.saleNo,
              name: input.name,
              email: input.email,
              phoneNumber: input.phoneNumber,
              image: getIdFromUrl(input.image),
              updatedAt: new Date(),
              updatedBy: ctx.session.user.id,
            })
            .where(
              and(
                eq(employees.id, input.id),
                eq(employees.createdBy, ctx.session.user.id)
              )
            );

          return input.id;
        }
        // CASE: Create
        else {
          const result = await trx
            .insert(employees)
            .values({
              id: crypto.randomUUID(),
              saleNo: input.saleNo,
              name: input.name,
              email: input.email,
              phoneNumber: input.phoneNumber,
              image: getIdFromUrl(input.image),
              createdBy: ctx.session.user.id,
              updatedBy: ctx.session.user.id,
            })
            .returning({
              id: employees.id,
            });

          return result[0].id;
        }
      });
    }),
  generatePresignUrl: generatePresignedUrlProcedure((ctx) => ({
    readAccessControl: {
      rule: "userId",
      userId: ctx.session?.user.id,
    },
    writeAccessControl: {
      rule: "userId",
      userId: ctx.session?.user.id,
    },
    isRequireAuth: true,
  })),
});
