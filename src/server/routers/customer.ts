import { Customer } from "../models/customer";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod"
import { eq } from "drizzle-orm"
import { customers, customerBankAccounts, customerContacts } from "@/db/schema/customer";
import { TRPCError } from "@trpc/server";


export const productRouter = createTRPCRouter({
    //Get Customer
    getCustomer: protectedProcedure
        .input(z.string().uuid("Invalid uuid"))
        .output(Customer.schemas.createCustomerInput)
        .query(async ({ ctx, input }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select()
                    .from(customers)
                    .where(
                        eq(customers.id, input)
                    )
                    .limit(1)
                return result[0];
            });

        }),

    //Get Customers
    getCustomers: protectedProcedure
        .output(z.array(Customer.schemas.createCustomerInput))
        .query(async ({ ctx }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select()
                    .from(customers)
                return result;
            });
        }),

    createCustomer: protectedProcedure
        .input(Customer.schemas.createCustomerInput)
        .output(Customer.schemas.createCustomerOutputSchema)
        .mutation(async ({ input, ctx }) => {
            return await ctx.db.transaction(async (trx) => {
                //Create Customer
                const createResult = await trx
                    .insert(customers)
                    .values({
                        id: crypto.randomUUID(),
                        name: String(input.name),
                        taxId: String(input.taxId),
                        address: String(input.address),
                        shipping_address: String(input.shipping_address),
                        zipcode: String(input.zipcode),
                        isBranch: Boolean(input.isBranch),
                        branchCode: String(input.branchCode),
                        branchName: String(input.branchName),
                        businessType: String(input.businessType),
                        email: String(input.email),
                        telelphoneNumber: String(input.telelphoneNumber),
                        phoneNumber: String(input.phoneNumber),
                        faxNumber: String(input.faxNumber),
                        website: String(input.website),
                        notes: String(input.notes),
                        createdAt: new Date(Date.now()),
                        createdBy: input.createdBy,
                        updatedAt: new Date(Date.now()),
                        updatedBy: input.updatedBy
                    })
                    .returning({
                        id: customers.id,
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

    //Get Customer contact
    getCustomerContact: protectedProcedure
        .input(z.string().uuid("Invalid uuid"))
        .output(Customer.schemas.getCustomerContactInput)
        .query(async ({ ctx, input }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select()
                    .from(customerContacts)
                    .where(
                        eq(customerContacts.id, input)
                    )
                    .limit(1)
                return result[0];
            });

        }),

    //Create Customer contact
    createCustomerContact: protectedProcedure
        .input(Customer.schemas.createCustomerContactInput)
        .output(Customer.schemas.createCustomerContactOutput)
        .mutation(async ({ input, ctx }) => {
            return await ctx.db.transaction(async (trx) => {
                //Create Customer contact
                const createResult = await trx
                    .insert(customerContacts)
                    .values({
                        id: crypto.randomUUID(),
                        customerId: String(input.customerId),
                        contactName: String(input.contactName),
                        email: String(input.email),
                        phoneNumber: String(input.phoneNumber),
                        createdAt: new Date(Date.now()),
                        createdBy: input.createdBy,
                        updatedAt: new Date(Date.now()),
                        updatedBy: input.updatedBy
                    })
                    .returning({
                        id: customerContacts.id,
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

    //Get Customer bank account
    getCustomerBankAccount: protectedProcedure
        .input(z.string().uuid("Invalid uuid"))
        .output(Customer.schemas.createCustomerBankAccountsInput)
        .query(async ({ ctx, input }) => {
            return ctx.db.transaction(async (trx) => {
                const result = await trx
                    .select()
                    .from(customerBankAccounts)
                    .where(
                        eq(customerBankAccounts.id, input)
                    )
                    .limit(1)
                return result[0];
            });

        }),

    //Create Customer Bank Accounts
    createCustomerBankAccounts: protectedProcedure
        .input(Customer.schemas.createCustomerBankAccountsInput)
        .output(Customer.schemas.createCustomerBankAccountsOutput)
        .mutation(async ({ input, ctx }) => {
            return await ctx.db.transaction(async (trx) => {
                //Create Bank Accounts
                const createResult = await trx
                    .insert(customerBankAccounts)
                    .values({
                        id: crypto.randomUUID(),
                        customerId: String(input.customerId),
                        bank: String(input.bank),
                        accountNumber: String(input.accountNumber),
                        bankBranch: String(input.bankBranch),
                        accountType: String(input.accountType),
                        createdAt: new Date(Date.now()),
                        createdBy: input.createdBy,
                        updatedAt: new Date(Date.now()),
                        updatedBy: input.updatedBy
                    })
                    .returning({
                        id: customerBankAccounts.id,
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

