import { Customer, baseBankAccount } from "../models/customer";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { string, z } from "zod";
import { and, eq, inArray, like, sql, ne, notInArray } from "drizzle-orm";
import {
  customers,
  customerBankAccounts,
  customerContacts,
} from "@/db/schema/customer";
import { TRPCError } from "@trpc/server";
import { Contact } from "lucide-react";
import { Result } from "postcss";

export const customerRouter = createTRPCRouter({
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
            creditDate: customerBankAccounts.creditDate,
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
            creditDate: customerBankAccounts.creditDate,
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
  getPaginateCustomers: protectedProcedure
    .input(Customer.schemas.paginateInput)
    .output(Customer.schemas.paginateOutput)
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction(async (trx) => {
        const { page, itemsPerPage, ...filters } = input;

        // Filters
        const whereClause = and(
          eq(customers.createdBy, ctx.session.user.id),
          filters.keyword // Filter: Keyword
            ? like(customers.name, `%${filters.keyword}%`)
            : undefined
        );

        const count = await ctx.db
          .select({
            count: sql<number>`CAST(COUNT(*) AS INT)`,
          })
          .from(customers)
          .where(whereClause);

        const list = await ctx.db
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
          .where(whereClause)
          .limit(itemsPerPage)
          .offset((page - 1) * itemsPerPage);

        const ids = list.map((r) => r.id);

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
            creditDate: customerBankAccounts.creditDate,
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

        const returnList = list.map((r) => {
          const contacts = contactsByCustomerId[r.id] || [];
          const bankAccounts = bankAccountsByCustomerId[r.id] || [];
          return {
            ...r,
            contacts,
            bankAccounts,
          };
        });

        return {
          count: count[0].count,
          list: returnList,
          currentPage: page,
          totalPage: Math.ceil(count[0].count / itemsPerPage),
        };
      });
    }),
  createOrUpdateCustomer: protectedProcedure
    .input(Customer.schemas.formInput)
    .output(Customer.schemas.formOutput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.transaction(async (trx) => {
        // CASE: Create
        const id = input.id;
        if (!id) {
          const createResult = await trx
            .insert(customers)
            .values({
              id: crypto.randomUUID(),
              name: input.name,
              taxId: input.taxId,
              address: input.address,
              shippingAddress: input.shippingAddress,
              zipcode: input.zipcode,
              isBranch: input.isBranch,
              branchCode: input.branchCode,
              branchName: input.branchName,
              businessType: input.businessType,
              email: input.email,
              telephoneNumber: input.telephoneNumber,
              phoneNumber: input.phoneNumber,
              faxNumber: input.faxNumber,
              website: input.website,
              notes: input.notes,
              createdBy: ctx.session.user.id,
            })
            .returning({
              id: customers.id,
            });

          // Throw error if createResult is empty
          if (createResult.length === 0)
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create customer",
            });

          // Insert Customer Contact
          if (input.contacts.length > 0) {
            await trx.insert(customerContacts).values(
              input.contacts.map((contact) => ({
                id: crypto.randomUUID(),
                customerId: createResult[0].id,
                contactName: contact.contactName,
                email: contact.email,
                phoneNumber: contact.phoneNumber,
              }))
            );
          }

          // Insert Customer Bank Account
          if (input.bankAccounts.length > 0) {
            await trx.insert(customerBankAccounts).values(
              input.bankAccounts.map((BankAccount) => ({
                id: crypto.randomUUID(),
                customerId: createResult[0].id,
                bank: BankAccount.bank,
                accountNumber: BankAccount.accountNumber,
                bankBranch: BankAccount.bankBranch,
                accountType: BankAccount.accountType,
                creditDate: BankAccount.creditDate,
              }))
            );
          }
          return createResult[0].id;
        }
        // CASE: Update
        else {
          // Find Customer
          const customer = await trx
            .select({
              id: customers.id,
            })
            .from(customers)
            .where(
              and(
                eq(customers.id, id),
                eq(customers.createdBy, ctx.session.user.id)
              )
            )
            .limit(1);

          // Throw error if customer is empty
          if (customer.length === 0) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Customer not found",
            });
          }

          // Update Customer
          await trx
            .update(customers)
            .set({
              name: input.name,
              taxId: input.taxId,
              address: input.address,
              shippingAddress: input.shippingAddress,
              zipcode: input.zipcode,
              isBranch: input.isBranch,
              branchCode: input.branchCode,
              branchName: input.branchName,
              businessType: input.businessType,
              email: input.email,
              telephoneNumber: input.telephoneNumber,
              phoneNumber: input.phoneNumber,
              faxNumber: input.faxNumber,
              website: input.website,
              notes: input.notes,
              updatedBy: ctx.session.user.id,
              updatedAt: new Date(Date.now()),
            })
            .where(eq(customers.id, id));

          const currentContactIds: string[] = [];
          // Upsert Customer Contact
          if (input.contacts.length > 0) {
            input.contacts.forEach(async (contact) => {
              const currentId = contact.id ?? crypto.randomUUID();
              await trx
                .insert(customerContacts)
                .values({
                  id: currentId,
                  customerId: id,
                  contactName: contact.contactName,
                  email: contact.email,
                  phoneNumber: contact.phoneNumber,
                  createdBy: ctx.session.user.id,
                  updatedBy: ctx.session.user.id,
                })
                .onConflictDoUpdate({
                  target: customerContacts.id,
                  set: {
                    id: currentId,
                    customerId: id,
                    contactName: contact.contactName,
                    email: contact.email,
                    phoneNumber: contact.phoneNumber,
                    updatedBy: ctx.session.user.id,
                    updatedAt: new Date(),
                  },
                });
              currentContactIds.push(currentId);
            });
          }
          // Delete Customer Contact
          if (currentContactIds.length > 0)
            await trx
              .delete(customerContacts)
              .where(
                and(
                  notInArray(customerContacts.id, currentContactIds),
                  eq(customerContacts.customerId, id)
                )
              );

          const currentBankAccountIds: string[] = [];
          // Upsert Customer BankAccount
          if (input.bankAccounts.length > 0) {
            input.bankAccounts.forEach(async (bankAccount) => {
              const currentId = bankAccount.id ?? crypto.randomUUID();
              await trx
                .insert(customerBankAccounts)
                .values({
                  id: currentId,
                  customerId: id,
                  bank: bankAccount.bank,
                  accountNumber: bankAccount.accountNumber,
                  bankBranch: bankAccount.bankBranch,
                  accountType: bankAccount.accountType,
                  creditDate: bankAccount.creditDate,
                  createdBy: ctx.session.user.id,
                  createdAt: new Date(Date.now()),
                })
                .onConflictDoUpdate({
                  target: customerBankAccounts.id,
                  set: {
                    id: currentId,
                    customerId: id,
                    bank: bankAccount.bank,
                    accountNumber: bankAccount.accountNumber,
                    bankBranch: bankAccount.bankBranch,
                    accountType: bankAccount.accountType,
                    creditDate: bankAccount.creditDate,
                    updatedBy: ctx.session.user.id,
                    updatedAt: new Date(Date.now()),
                  },
                });
              currentBankAccountIds.push(currentId);
            });
          }
          //Delete Customer BankAccount
          if (currentBankAccountIds.length > 0)
            await trx
              .delete(customerBankAccounts)
              .where(
                and(
                  notInArray(customerBankAccounts.id, currentBankAccountIds),
                  eq(customerBankAccounts.customerId, id)
                )
              );

          return id;
        }
      });
    }),
});
