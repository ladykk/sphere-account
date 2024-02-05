import { Customer } from "../models/customer";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import {
  customers,
  customerBankAccounts,
  customerContacts,
} from "@/db/schema/customer";
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
  //Get Customer
  getCustomer: protectedProcedure
    .input(z.string().uuid("Invalid uuid"))
    .output(Customer.schemas.base)
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction(async (trx) => {
        const result = await trx
          .select({
            id: customers.id,
            name: customers.name,
            taxId: customers.taxId,
            address: customers.address,
            shippingAddress: customers.shippingAddress,
            zipcode: customers.zipcode,
            isBranch: customers.isBranch,
            branchCode: customers.branchCode,
            branchName: customers.branchName,
            businessType: customers.businessType,
            email: customers.email,
            telephoneNumber: customers.telephoneNumber,
            phoneNumber: customers.phoneNumber,
            faxNumber: customers.faxNumber,
            website: customers.website,
            notes: customers.notes,
            createdAt: customers.createdAt,
            createdBy: customers.createdBy,
            updatedAt: customers.updatedAt,
            updatedBy: customers.updatedBy,
          })
          .from(customers)
          .where(
            and(
              eq(customers.id, input),
              eq(customers.createdBy, ctx.session.user.id)
            )
          )
          .limit(1);

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Customer not found",
          });
        }

        const contactsResult = await trx
          .select({
            id: customerContacts.id,
            customerId: customerContacts.customerId,
            contactName: customerContacts.contactName,
            email: customerContacts.email,
            phoneNumber: customerContacts.phoneNumber,
            createdAt: customerContacts.createdAt,
            createdBy: customerContacts.createdBy,
            updatedAt: customerContacts.updatedAt,
            updatedBy: customerContacts.updatedBy,
          })
          .from(customerContacts)
          .where(eq(customerContacts.customerId, input));

        const bankAccountsResult = await trx
          .select({
            id: customerBankAccounts.id,
            customerId: customerBankAccounts.customerId,
            bank: customerBankAccounts.bank,
            accountNumber: customerBankAccounts.accountNumber,
            bankBranch: customerBankAccounts.bankBranch,
            accountType: customerBankAccounts.accountType,
            createdAt: customerBankAccounts.createdAt,
            createdBy: customerBankAccounts.createdBy,
            updatedAt: customerBankAccounts.updatedAt,
            updatedBy: customerBankAccounts.updatedBy,
          })
          .from(customerBankAccounts)
          .where(eq(customerBankAccounts.customerId, input));
        return {
          ...result[0],
          contacts: contactsResult,
          bankAccounts: bankAccountsResult,
        };
      });
    }),

  //Get Customers
  getCustomers: protectedProcedure
    .output(z.array(Customer.schemas.base))
    .query(async ({ ctx }) => {
      return ctx.db.transaction(async (trx) => {
        const result = await trx
          .select({
            id: customers.id,
            name: customers.name,
            taxId: customers.taxId,
            address: customers.address,
            shippingAddress: customers.shippingAddress,
            zipcode: customers.zipcode,
            isBranch: customers.isBranch,
            branchCode: customers.branchCode,
            branchName: customers.branchName,
            businessType: customers.businessType,
            email: customers.email,
            telephoneNumber: customers.telephoneNumber,
            phoneNumber: customers.phoneNumber,
            faxNumber: customers.faxNumber,
            website: customers.website,
            notes: customers.notes,
            createdAt: customers.createdAt,
            createdBy: customers.createdBy,
            updatedAt: customers.updatedAt,
            updatedBy: customers.updatedBy,
          })
          .from(customers)
          .where(eq(customers.createdBy, ctx.session.user.id));

        const ids = result.map((r) => r.id);

        const contactsResult = await trx
          .select({
            id: customerContacts.id,
            customerId: customerContacts.customerId,
            contactName: customerContacts.contactName,
            email: customerContacts.email,
            phoneNumber: customerContacts.phoneNumber,
            createdAt: customerContacts.createdAt,
            createdBy: customerContacts.createdBy,
            updatedAt: customerContacts.updatedAt,
            updatedBy: customerContacts.updatedBy,
          })
          .from(customerContacts)
          .where(inArray(customerContacts.customerId, ids));

        const contactsByCustomerId = contactsResult.reduce((acc, contact) => {
          if (!acc[contact.customerId]) {
            acc[contact.customerId] = [];
          }
          acc[contact.customerId].push(contact);
          return acc;
        }, {} as Record<string, typeof contactsResult>);

        const bankAccountsResult = await trx
          .select({
            id: customerBankAccounts.id,
            customerId: customerBankAccounts.customerId,
            bank: customerBankAccounts.bank,
            accountNumber: customerBankAccounts.accountNumber,
            bankBranch: customerBankAccounts.bankBranch,
            accountType: customerBankAccounts.accountType,
            createdAt: customerBankAccounts.createdAt,
            createdBy: customerBankAccounts.createdBy,
            updatedAt: customerBankAccounts.updatedAt,
            updatedBy: customerBankAccounts.updatedBy,
          })
          .from(customerBankAccounts)
          .where(inArray(customerBankAccounts.customerId, ids));

        const bankAccountsByCustomerId = bankAccountsResult.reduce(
          (acc, bankAccount) => {
            if (!acc[bankAccount.customerId]) {
              acc[bankAccount.customerId] = [];
            }
            acc[bankAccount.customerId].push(bankAccount);
            return acc;
          },
          {} as Record<string, typeof bankAccountsResult>
        );

        return result.map((r) => {
          const contacts = contactsByCustomerId[r.id] || [];
          const bankAccounts = bankAccountsByCustomerId[r.id] || [];
          return {
            ...r,
            contacts,
            bankAccounts,
          };
        });
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
        if (result.length > 0) {
          return result[0];
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get customer",
          });
        }
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
          .where(eq(customerContacts.id, input))
          .limit(1);
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
            updatedBy: input.updatedBy,
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
            updatedBy: input.updatedBy,
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
});
