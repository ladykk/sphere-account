import { Product, category, unit } from "../models/product";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq, and, like, sql, isNotNull, or } from "drizzle-orm";
import { products } from "@/db/schema/product";
import { TRPCError } from "@trpc/server";
import { deleteFileById, getIdFromUrl, getUrlById } from "../modules/file";
import { generatePresignedUrlProcedure } from "../modules/file/trpc";


export const productRouter = createTRPCRouter({
    getProduct: protectedProcedure
        .input(z.string().uuid("Invalid uuid"))
        .output(Product.schemas.baseOutput)
        .query(async ({ ctx, input }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select({
                        id: products.id,
                        type: products.type,
                        name: products.name,
                        code: products.code,
                        category: products.category,
                        barcode: products.barcode,
                        sellingPrice: products.sellingPrice,
                        vatType: products.vatType,
                        description: products.description,
                        stock: products.stock,
                        unit: products.unit,
                        image: products.image,
                        createdAt: products.createdAt,
                        createdBy: products.createdBy,
                        updatedAt: products.updatedAt,
                        updatedBy: products.updatedBy,
                    })
                    .from(products)
                    .where(
                        and(
                            eq(products.id, input),
                            eq(products.createdBy, ctx.session.user.id)
                        )
                    )
                    .limit(1);

                if (result.length === 0) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Product not found",
                    });
                }
                return {
                    ...result[0],
                    image: result[0].image ? getUrlById(result[0].image) : null,
                }

            });
        }),

    getProducts: protectedProcedure
        .output(z.array(Product.schemas.baseOutput))
        .query(async ({ ctx }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select({
                        id: products.id,
                        type: products.type,
                        name: products.name,
                        code: products.code,
                        category: products.category,
                        barcode: products.barcode,
                        sellingPrice: products.sellingPrice,
                        vatType: products.vatType,
                        description: products.description,
                        stock: products.stock,
                        unit: products.unit,
                        image: products.image,
                        createdAt: products.createdAt,
                        createdBy: products.createdBy,
                        updatedAt: products.updatedAt,
                        updatedBy: products.updatedBy,
                    })
                    .from(products)
                    .where(eq(products.createdBy, ctx.session.user.id));
                return result.map((r) => ({
                    ...r,
                    image: r.image ? getUrlById(r.image) : null,
                }));
            });
        }),

    getPaginateProduct: protectedProcedure
        .input(Product.schemas.paginateInput)
        .output(Product.schemas.paginateOutput)
        .query(async ({ ctx, input }) => {
            return ctx.db.transaction(async (trx) => {
                const { page, itemsPerPage, ...filters } = input;

                // Filters
                const whereClause = and(
                    eq(products.createdBy, ctx.session.user.id),
                    filters.keyword // Filter: Keyword
                        ? or(
                            like(products.name, `%${filters.keyword}%`),
                            like(products.code, `%${filters.keyword}%`),
                            like(products.barcode, `%${filters.keyword}%`)
                        )
                        : undefined,
                    filters.category // Filter: Category
                        ? eq(products.category, filters.category)
                        : undefined,
                    filters.type // Filter: Type
                        ? eq(products.type, filters.type)
                        : undefined
                );

                const count = await trx
                    .select({
                        count: sql<number>`CAST(COUNT(*) AS INT)`,
                    })
                    .from(products)
                    .where(whereClause)
                    .limit(1);

                const list = await trx
                    .select({
                        id: products.id,
                        type: products.type,
                        name: products.name,
                        code: products.code,
                        category: products.category,
                        barcode: products.barcode,
                        sellingPrice: products.sellingPrice,
                        vatType: products.vatType,
                        description: products.description,
                        stock: products.stock,
                        unit: products.unit,
                        image: products.image,
                        createdAt: products.createdAt,
                        createdBy: products.createdBy,
                        updatedAt: products.updatedAt,
                        updatedBy: products.updatedBy,
                    })
                    .from(products)
                    .where(whereClause)
                    .limit(itemsPerPage)
                    .offset((page - 1) * itemsPerPage);

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

    createOrUpdateProduct: protectedProcedure
        .input(Product.schemas.formInput)
        .output(z.string().uuid())
        .mutation(async ({ ctx, input }) => {
            return ctx.db.transaction(async (trx) => {
                // CASE: Create
                if (!input.id) {
                    const result = await trx
                        .insert(products)
                        .values({
                            id: crypto.randomUUID(),
                            type: input.type,
                            name: input.name,
                            code: input.code,
                            category: String(input.category),
                            barcode: input.barcode,
                            sellingPrice: String(input.sellingPrice),
                            vatType: input.vatType,
                            description: input.description,
                            unit: input.unit,
                            createdBy: ctx.session.user.id,
                            updatedBy: ctx.session.user.id,
                        })
                        .returning({
                            id: products.id,
                        });
                    return result[0].id;
                }

                //CASE: Update
                else {
                    //Find product
                    const oldData = await trx
                        .select({
                            id: products.id,
                            image: products.image,
                        })
                        .from(products)
                        .where(
                            and(
                                eq(products.id, input.id),
                                eq(products.createdBy, ctx.session.user.id)
                            )
                        )
                        .limit(1);

                    // Check if product exists
                    if (oldData.length === 0) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: "Product not found",
                        });
                    }

                    if (
                        oldData[0].image &&
                        oldData[0].image !== getIdFromUrl(input.image)
                    ) {
                        await deleteFileById(oldData[0].image);
                    }
                    //Update product
                    await trx
                        .update(products)
                        .set({
                            type: input.type,
                            name: input.name,
                            code: input.code,
                            category: String(input.category),
                            barcode: input.barcode,
                            sellingPrice: String(input.sellingPrice),
                            vatType: input.vatType,
                            description: input.description,
                            unit: input.unit,
                            updatedAt: sql`CURRENT_TIMESTAMP`,
                            updatedBy: ctx.session.user.id,
                        })
                        .where(
                            and(
                                eq(products.id, input.id),
                                eq(products.createdBy, ctx.session.user.id),
                            )
                        );
                    return input.id;
                }
            });
        }),
    getCatagories: protectedProcedure
        .output(z.array(category))
        .query(async ({ ctx }) => {
            return ctx.db.transaction(async (trx) => {
                const categories = await trx
                    .select({
                        category: products.category,
                    })
                    .from(products)
                    .where(
                        and(
                            eq(products.createdBy, ctx.session.user.id),
                            isNotNull(products.category)
                        )
                    )
                    .groupBy(products.category);
                return categories.map((str) => str.category);
            });
        }),
    getUnits: protectedProcedure.output(z.array(unit)).query(async ({ ctx }) => {
        return ctx.db.transaction(async (trx) => {
            const units = await trx
                .select({
                    unit: products.unit,
                })
                .from(products)
                .where(eq(products.createdBy, ctx.session.user.id))
                .groupBy(products.unit);
            return units.map((str) => str.unit);
        });
    }),
});
