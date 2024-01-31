import { Product } from "../models/product";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod"
import { eq } from "drizzle-orm"
import { products } from "@/db/schema/product";
import { TRPCError } from "@trpc/server";


export const productRouter = createTRPCRouter({
    //Get Product
    getProduct: protectedProcedure
        .input(z.string().uuid("Invalid uuid"))
        .output(Product.schemas.base)
        .query(async ({ ctx, input }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select()
                    .from(products)
                    .where(
                        eq(products.id, input)
                    )
                    .limit(1)
                return result[0];
            });

        }),

    //Get Products
    getProducts: protectedProcedure
        .output(z.array(Product.schemas.base))
        .query(async ({ ctx }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select()
                    .from(products)
                return result;
            });
        }),

    //CreateOrUpdate Product
    createOrUpdate: protectedProcedure
        .input(Product.schemas.base)
        .output(Product.schemas.createOutputSchemas)
        .mutation(async ({ input, ctx }) => {
            return ctx.db.transaction(async (trx) => {

                const createProduct = await trx
                    .insert(products)
                    .values({
                        id: input.id,
                        type: input.type,
                        name: input.name,
                        code: input.code,
                        category: input.category,
                        barcode: input.barcode,
                        sellingPrice: String(input.sellingPrice),
                        vatType: input.vatType,
                        description: input.description,
                        quantity: input.quantity,
                        unit: input.unit,
                        createdAt: input.createdAt,
                        createdBy: input.createdBy,
                        updatedAt: input.updatedAt,
                        updatedBy: input.updatedBy
                    })
                    .returning({
                        id: products.id
                    })

                if (createProduct.length === 0)
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create product",
                    });

                return createProduct[0];
            })

        })

})
// return Product.schemas.base.parse(input)