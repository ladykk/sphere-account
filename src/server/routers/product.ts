import { Product } from "../models/product";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod"
import { eq, and, like, sql } from "drizzle-orm"
import { products } from "@/db/schema/product";
import { TRPCError } from "@trpc/server";



export const productRouter = createTRPCRouter({
    //Get Product
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
                        quantity: products.quantity,
                        unit: products.unit,
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
                    .limit(1)
                if (result.length === 0) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Product not found",
                    });
                }
                return result[0];
            });

        }),

    //Get Products
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
                        quantity: products.quantity,
                        unit: products.unit,
                        createdAt: products.createdAt,
                        createdBy: products.createdBy,
                        updatedAt: products.updatedAt,
                        updatedBy: products.updatedBy,
                    })
                    .from(products)
                    .where(
                        eq(products.createdBy, ctx.session.user.id)
                    );
                return result;
            });
        }),

    getPaginateProduct: protectedProcedure
        .input(Product.schemas.paginateInput)
        .output(Product.schemas.paginateOutput)
        .query(async ({ ctx, input }) => {
            const { page, itemsPerPage, ...filters } = input;

            // Filters
            const whereClause = and(
                eq(products.createdBy, ctx.session.user.id),
                filters.keyword // Filter: Keyword
                    ? like(products.name, `%${filters.keyword}%`)
                    : undefined,

            );

            const count = await ctx.db
                .select({
                    count: sql<number>`CAST(COUNT(*) AS INT)`,
                })
                .from(products)
                .where(whereClause);

            const list = await ctx.db
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
                    quantity: products.quantity,
                    unit: products.unit,
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
                list,
                currentPage: page,
                totalPage: Math.ceil(count[0].count / itemsPerPage),
            };
        }),
    //CreateOrUpdate Product
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
                            category:  String(input.category),
                            barcode: input.barcode,
                            sellingPrice: String(input.sellingPrice),
                            vatType: input.vatType,
                            description: input.description,                   
                            unit: input.unit,
                            createdBy: ctx.session.user.id,
                            updatedBy: ctx.session.user.id
                        })
                        .returning({
                            id: products.id
                        });
                    return result[0].id;
                }

                //CASE: Update
                else {
                    //Find product
                    const product = await trx
                        .select({
                            id: products.id,
                        })
                        .from(products)
                        .where(
                            and(
                                eq(products.id, input.id),
                                eq(products.createdBy, ctx.session.user.id)
                            )
                        )
                        .limit(1);

                    //check if product exits
                    if (product.length === 0) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: "Product not found",
                        });
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
                            updatedBy: ctx.session.user.id
                        })
                        .where(
                            eq(products.id, input.id)
                        );
                    return input.id;
                }
            });

        }),

});