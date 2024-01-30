import { Product } from "../models/product";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod"
import { eq } from "drizzle-orm"
import { products } from "@/db/schema/product";


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
        .input(z.string().uuid("Invalid uuid"))
        .output(Product.schemas.base)
        .query(async ({ ctx }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select()
                    .from(products)
                return result[0];
            });

        }),
    

})



//CreateOrUpdate Product
// return Product.schemas.base.parse(input)