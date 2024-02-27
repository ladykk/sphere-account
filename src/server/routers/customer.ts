import { Customer, baseBankAccount } from "../models/customer";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { string, z } from "zod";
import {
  and,
  eq,
  inArray,
  like,
  sql,
  ne,
  notInArray,
  isNotNull,
} from "drizzle-orm";
import {
  customers,
  customerBankAccounts,
  customerContacts,
  customerAttachments,
} from "@/db/schema/customer";
import { TRPCError } from "@trpc/server";
import { files } from "@/db/schema/file";
import { deleteFileById, getIdFromUrl, getUrlById } from "../modules/file";
import { generatePresignedUrlProcedure } from "../modules/file/trpc";

export const customerRouter = createTRPCRouter({
  getCustomer: protectedProcedure
    .input(z.string().uuid("Invalid uuid"))
    .output(Customer.schemas.base)
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction(async (trx) => {
        const result = await trx
          .select({
            id: customers.id,
            code: customers.code,
            name: customers.name,
            type: customers.type,
            taxId: customers.taxId,
            address: customers.address,
            zipcode: customers.zipcode,
            shippingAddress: customers.shippingAddress,
            shippingZipcode: customers.shippingZipcode,
            isBranch: customers.isBranch,
            branchCode: customers.branchCode,
            branchName: customers.branchName,
            businessType: customers.businessType,
            email: customers.email,
            telephoneNumber: customers.telephoneNumber,
            phoneNumber: customers.phoneNumber,
            faxNumber: customers.faxNumber,
            website: customers.website,
            creditDate: customers.creditDate,
            notes: customers.notes,
            isActive: customers.isActive,
            createdAt: customers.createdAt,
            createdBy: customers.createdBy,
            updatedAt: customers.updatedAt,
            updatedBy: customers.updatedBy,
          })
          .from(customers)
          .where(and(eq(customers.id, input)))
          .limit(1);

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Customer not found",
          });
        }

        // Contacts
        const contactsResult = await trx
          .select({
            id: customerContacts.id,
            customerId: customerContacts.customerId,
            contactName: customerContacts.contactName,
            email: customerContacts.email,
            phoneNumber: customerContacts.phoneNumber,
            isActive: customerContacts.isActive,
            createdAt: customerContacts.createdAt,
            createdBy: customerContacts.createdBy,
            updatedAt: customerContacts.updatedAt,
            updatedBy: customerContacts.updatedBy,
          })
          .from(customerContacts)
          .where(eq(customerContacts.customerId, input));

        // Bank Accounts
        const bankAccountsResult = await trx
          .select({
            id: customerBankAccounts.id,
            customerId: customerBankAccounts.customerId,
            bank: customerBankAccounts.bank,
            accountNumber: customerBankAccounts.accountNumber,
            bankBranch: customerBankAccounts.bankBranch,
            accountType: customerBankAccounts.accountType,
            isActive: customerBankAccounts.isActive,
            createdAt: customerBankAccounts.createdAt,
            createdBy: customerBankAccounts.createdBy,
            updatedAt: customerBankAccounts.updatedAt,
            updatedBy: customerBankAccounts.updatedBy,
          })
          .from(customerBankAccounts)
          .where(eq(customerBankAccounts.customerId, input));

        // Attachements
        const attachmentsResult = await trx
          .select({
            id: customerAttachments.id,
            customerId: customerAttachments.customerId,
            fileId: customerAttachments.fileId,
            fileName: files.fileName,
            fileSize: files.fileSize,
            fileType: files.fileType,
            fileCategory: customerAttachments.category,
            uploadedBy: files.issuedBy,
            uploadedAt: files.issuedAt,
          })
          .from(customerAttachments)
          .innerJoin(files, eq(customerAttachments.fileId, files.id))
          .where(eq(customerAttachments.customerId, input))
          .then((result) =>
            result.map((r) => ({
              ...r,
              fileUrl: getUrlById(r.fileId),
            }))
          );

        const test = {
          ...result[0],
          contacts: contactsResult,
          bankAccounts: bankAccountsResult,
          attachments: attachmentsResult,
        };
        return test;
      });
    }),
  getCustomers: protectedProcedure
    .output(z.array(Customer.schemas.base))
    .query(async ({ ctx }) => {
      return ctx.db.transaction(async (trx) => {
        const result = await trx
          .select({
            id: customers.id,
            code: customers.code,
            name: customers.name,
            type: customers.type,
            taxId: customers.taxId,
            address: customers.address,
            zipcode: customers.zipcode,
            shippingAddress: customers.shippingAddress,
            shippingZipcode: customers.shippingZipcode,
            isBranch: customers.isBranch,
            branchCode: customers.branchCode,
            branchName: customers.branchName,
            businessType: customers.businessType,
            email: customers.email,
            telephoneNumber: customers.telephoneNumber,
            phoneNumber: customers.phoneNumber,
            faxNumber: customers.faxNumber,
            website: customers.website,
            creditDate: customers.creditDate,
            notes: customers.notes,
            isActive: customers.isActive,
            createdAt: customers.createdAt,
            createdBy: customers.createdBy,
            updatedAt: customers.updatedAt,
            updatedBy: customers.updatedBy,
          })
          .from(customers);

        const ids = result.map((r) => r.id);

        const contactsResult =
          ids.length > 0
            ? await trx
                .select({
                  id: customerContacts.id,
                  customerId: customerContacts.customerId,
                  contactName: customerContacts.contactName,
                  email: customerContacts.email,
                  phoneNumber: customerContacts.phoneNumber,
                  isActive: customerContacts.isActive,
                  createdAt: customerContacts.createdAt,
                  createdBy: customerContacts.createdBy,
                  updatedAt: customerContacts.updatedAt,
                  updatedBy: customerContacts.updatedBy,
                })
                .from(customerContacts)
                .where(inArray(customerContacts.customerId, ids))
            : [];

        const contactsByCustomerId = contactsResult.reduce((acc, contact) => {
          if (!acc[contact.customerId]) {
            acc[contact.customerId] = [];
          }
          acc[contact.customerId].push(contact);
          return acc;
        }, {} as Record<string, typeof contactsResult>);

        const bankAccountsResult =
          ids.length > 0
            ? await trx
                .select({
                  id: customerBankAccounts.id,
                  customerId: customerBankAccounts.customerId,
                  bank: customerBankAccounts.bank,
                  accountNumber: customerBankAccounts.accountNumber,
                  bankBranch: customerBankAccounts.bankBranch,
                  accountType: customerBankAccounts.accountType,
                  isActive: customerBankAccounts.isActive,
                  createdAt: customerBankAccounts.createdAt,
                  createdBy: customerBankAccounts.createdBy,
                  updatedAt: customerBankAccounts.updatedAt,
                  updatedBy: customerBankAccounts.updatedBy,
                })
                .from(customerBankAccounts)
                .where(inArray(customerBankAccounts.customerId, ids))
            : [];

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

        const attachementsResult =
          ids.length > 0
            ? await trx
                .select({
                  id: customerAttachments.id,
                  customerId: customerAttachments.customerId,
                  fileId: customerAttachments.fileId,
                  fileName: files.fileName,
                  fileSize: files.fileSize,
                  fileType: files.fileType,
                  fileCategory: customerAttachments.category,
                  uploadedBy: files.issuedBy,
                  uploadedAt: files.issuedAt,
                })
                .from(customerAttachments)
                .innerJoin(files, eq(customerAttachments.fileId, files.id))
                .where(inArray(customerAttachments.customerId, ids))
                .then((result) =>
                  result.map((r) => ({
                    ...r,
                    fileUrl: getUrlById(r.fileId),
                  }))
                )
            : [];

        const attachmentsByCustomerId = attachementsResult.reduce(
          (acc, attachment) => {
            if (!acc[attachment.customerId]) {
              acc[attachment.customerId] = [];
            }
            acc[attachment.customerId].push(attachment);
            return acc;
          },
          {} as Record<string, typeof attachementsResult>
        );

        return result.map((r) => {
          const contacts = contactsByCustomerId[r.id] || [];
          const bankAccounts = bankAccountsByCustomerId[r.id] || [];
          const attachments = attachmentsByCustomerId[r.id] || [];
          return {
            ...r,
            contacts,
            bankAccounts,
            attachments,
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
            code: customers.code,
            name: customers.name,
            type: customers.type,
            taxId: customers.taxId,
            address: customers.address,
            zipcode: customers.zipcode,
            shippingAddress: customers.shippingAddress,
            shippingZipcode: customers.shippingZipcode,
            isBranch: customers.isBranch,
            branchCode: customers.branchCode,
            branchName: customers.branchName,
            businessType: customers.businessType,
            email: customers.email,
            telephoneNumber: customers.telephoneNumber,
            phoneNumber: customers.phoneNumber,
            faxNumber: customers.faxNumber,
            website: customers.website,
            creditDate: customers.creditDate,
            notes: customers.notes,
            isActive: customers.isActive,
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

        const contactsResult =
          ids.length > 0
            ? await trx
                .select({
                  id: customerContacts.id,
                  customerId: customerContacts.customerId,
                  contactName: customerContacts.contactName,
                  email: customerContacts.email,
                  phoneNumber: customerContacts.phoneNumber,
                  isActive: customerContacts.isActive,
                  createdAt: customerContacts.createdAt,
                  createdBy: customerContacts.createdBy,
                  updatedAt: customerContacts.updatedAt,
                  updatedBy: customerContacts.updatedBy,
                })
                .from(customerContacts)
                .where(inArray(customerContacts.customerId, ids))
            : [];

        const contactsByCustomerId = contactsResult.reduce((acc, contact) => {
          if (!acc[contact.customerId]) {
            acc[contact.customerId] = [];
          }
          acc[contact.customerId].push(contact);
          return acc;
        }, {} as Record<string, typeof contactsResult>);

        const bankAccountsResult =
          ids.length > 0
            ? await trx
                .select({
                  id: customerBankAccounts.id,
                  customerId: customerBankAccounts.customerId,
                  bank: customerBankAccounts.bank,
                  accountNumber: customerBankAccounts.accountNumber,
                  bankBranch: customerBankAccounts.bankBranch,
                  accountType: customerBankAccounts.accountType,
                  isActive: customerBankAccounts.isActive,
                  createdAt: customerBankAccounts.createdAt,
                  createdBy: customerBankAccounts.createdBy,
                  updatedAt: customerBankAccounts.updatedAt,
                  updatedBy: customerBankAccounts.updatedBy,
                })
                .from(customerBankAccounts)
                .where(inArray(customerBankAccounts.customerId, ids))
            : [];

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

        const attachmentsResult =
          ids.length > 0
            ? await trx
                .select({
                  id: customerAttachments.id,
                  customerId: customerAttachments.customerId,
                  fileId: customerAttachments.fileId,
                  fileName: files.fileName,
                  fileSize: files.fileSize,
                  fileType: files.fileType,
                  fileCategory: customerAttachments.category,
                  uploadedBy: files.issuedBy,
                  uploadedAt: files.issuedAt,
                })
                .from(customerAttachments)
                .innerJoin(files, eq(customerAttachments.fileId, files.id))
                .where(inArray(customerAttachments.customerId, ids))
                .then((result) =>
                  result.map((r) => ({
                    ...r,
                    fileUrl: getUrlById(r.fileId),
                  }))
                )
            : [];

        const attachmentsByCustomerId = attachmentsResult.reduce(
          (acc, attachment) => {
            if (!acc[attachment.customerId]) {
              acc[attachment.customerId] = [];
            }
            acc[attachment.customerId].push(attachment);
            return acc;
          },
          {} as Record<string, typeof attachmentsResult>
        );

        const returnList = list.map((r) => {
          const contacts = contactsByCustomerId[r.id] || [];
          const bankAccounts = bankAccountsByCustomerId[r.id] || [];
          const attachments = attachmentsByCustomerId[r.id] || [];
          return {
            ...r,
            contacts,
            bankAccounts,
            attachments,
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
              code: input.code,
              name: input.name,
              type: input.type,
              taxId: input.taxId,
              address: input.address,
              zipcode: input.zipcode,
              shippingAddress: input.shippingAddress,
              shippingZipcode: input.shippingZipcode,
              isBranch: input.isBranch,
              branchCode: input.branchCode,
              branchName: input.branchName,
              businessType: input.businessType,
              email: input.email,
              telephoneNumber: input.telephoneNumber,
              phoneNumber: input.phoneNumber,
              faxNumber: input.faxNumber,
              website: input.website,
              creditDate: input.creditDate,
              notes: input.notes,
              isActive: input.isActive,
              createdBy: ctx.session.user.id,
              updatedBy: ctx.session.user.id,
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
                isActive: contact.isActive,
              }))
            );
          }

          // Insert Customer Bank Account
          if (input.bankAccounts.length > 0) {
            await trx.insert(customerBankAccounts).values(
              input.bankAccounts.map((bankAccount) => ({
                id: crypto.randomUUID(),
                customerId: createResult[0].id,
                bank: bankAccount.bank,
                accountNumber: bankAccount.accountNumber,
                bankBranch: bankAccount.bankBranch,
                accountType: bankAccount.accountType,
                isActive: bankAccount.isActive,
              }))
            );
          }

          const customerAttachmentValues = input.attachments
            .map((attachment) => ({
              id: crypto.randomUUID(),
              customerId: createResult[0].id,
              fileId: getIdFromUrl(attachment.fileUrl) as string,
              category: attachment.fileCategory,
            }))
            // Important: Filter out attachments without fileUrl
            .filter((attachment) => !!attachment.fileId);

          // Insert Customer Attachments
          if (customerAttachmentValues.length > 0)
            await trx
              .insert(customerAttachments)
              .values(customerAttachmentValues);

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
            .where(and(eq(customers.id, id)))
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
              code: input.code,
              name: input.name,
              type: input.type,
              taxId: input.taxId,
              address: input.address,
              zipcode: input.zipcode,
              shippingAddress: input.shippingAddress,
              shippingZipcode: input.shippingZipcode,
              isBranch: input.isBranch,
              branchCode: input.branchCode,
              branchName: input.branchName,
              businessType: input.businessType,
              email: input.email,
              telephoneNumber: input.telephoneNumber,
              phoneNumber: input.phoneNumber,
              faxNumber: input.faxNumber,
              website: input.website,
              creditDate: input.creditDate,
              notes: input.notes,
              isActive: input.isActive,
              updatedBy: ctx.session.user.id,
              updatedAt: new Date(),
            })
            .where(eq(customers.id, id));

          const currentContactIds: string[] = [];
          // Upsert Customer Contact
          if (input.contacts.length > 0) {
            for (const contact of input.contacts) {
              const currentId = contact.id ?? crypto.randomUUID();
              await trx
                .insert(customerContacts)
                .values({
                  id: currentId,
                  customerId: id,
                  contactName: contact.contactName,
                  email: contact.email,
                  phoneNumber: contact.phoneNumber,
                  isActive: contact.isActive,
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
                    isActive: contact.isActive,
                    updatedBy: ctx.session.user.id,
                    updatedAt: new Date(),
                  },
                  where: and(
                    eq(customerContacts.id, currentId),
                    eq(customerContacts.customerId, id)
                  ),
                });
              currentContactIds.push(currentId);
            }
          }
          // Delete Customer Contact
          await trx
            .delete(customerContacts)
            .where(
              and(
                currentContactIds.length > 0
                  ? notInArray(customerContacts.id, currentContactIds)
                  : undefined,
                eq(customerContacts.customerId, id)
              )
            );

          const currentBankAccountIds: string[] = [];
          // Upsert Customer BankAccount
          if (input.bankAccounts.length > 0) {
            for (const bankAccount of input.bankAccounts) {
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
                  isActive: bankAccount.isActive,
                  createdBy: ctx.session.user.id,
                  updatedBy: ctx.session.user.id,
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
                    isActive: bankAccount.isActive,
                    updatedBy: ctx.session.user.id,
                    updatedAt: new Date(Date.now()),
                  },
                  where: and(
                    eq(customerBankAccounts.id, currentId),
                    eq(customerBankAccounts.customerId, id)
                  ),
                });
              currentBankAccountIds.push(currentId);
            }
          }
          //Delete Customer BankAccount
          await trx
            .delete(customerBankAccounts)
            .where(
              and(
                currentBankAccountIds.length > 0
                  ? notInArray(customerBankAccounts.id, currentBankAccountIds)
                  : undefined,
                eq(customerBankAccounts.customerId, id)
              )
            );

          // Get old attachments
          const oldAttachmentsResult = await trx
            .select({
              id: customerAttachments.id,
              fileId: customerAttachments.fileId,
            })
            .from(customerAttachments)
            .where(eq(customerAttachments.customerId, id));

          const oldAttachements = oldAttachmentsResult.reduce(
            (acc, attachment) => {
              acc[attachment.id] = attachment;
              return acc;
            },
            {} as Record<string, (typeof oldAttachmentsResult)[number]>
          );

          const currentAttachmentIds: string[] = [];

          // Upsert Customer Attachment
          if (input.attachments.length > 0) {
            for (const attachment of input.attachments) {
              // Skip if cannot extract file id from fileUrl
              const newFileId = getIdFromUrl(attachment.fileUrl);
              if (!newFileId) break;

              // Delete old file if fileUrl is different
              if (attachment.id) {
                const oldData = oldAttachements[attachment.id];
                if (oldData.fileId !== newFileId)
                  await deleteFileById(oldData.fileId, trx);
              }
              const currentId = attachment.id ?? crypto.randomUUID();
              await trx
                .insert(customerAttachments)
                .values({
                  id: currentId,
                  customerId: id,
                  fileId: newFileId,
                  category: attachment.fileCategory,
                })
                .onConflictDoUpdate({
                  target: customerAttachments.id,
                  set: {
                    customerId: id,
                    fileId: newFileId,
                    category: attachment.fileCategory,
                  },
                  where: and(
                    eq(customerAttachments.id, currentId),
                    eq(customerAttachments.customerId, id)
                  ),
                });
              currentAttachmentIds.push(currentId);
            }
          }

          // Delete Customer Attachment
          await trx
            .delete(customerAttachments)
            .where(
              and(
                currentAttachmentIds.length > 0
                  ? notInArray(customerAttachments.id, currentAttachmentIds)
                  : undefined,
                eq(customerAttachments.customerId, id)
              )
            );

          // Delete old file if not in currentAttachmentIds
          const oldAttachmentIds = Object.keys(oldAttachements).filter(
            (oldAttachmentId) => !currentAttachmentIds.includes(oldAttachmentId)
          );

          for (const oldAttachmentId of oldAttachmentIds) {
            await deleteFileById(oldAttachements[oldAttachmentId].fileId, trx);
          }

          return id;
        }
      });
    }),
  generatePresignUrl: generatePresignedUrlProcedure((ctx) => ({
    readAccessControl: {
      rule: "authenticated",
    },
    writeAccessControl: {
      rule: "authenticated",
    },
    isRequireAuth: true,
  })),
  getBusinessTypes: protectedProcedure
    .output(z.array(Customer.schemas.base.shape.businessType.unwrap()))
    .query(async ({ ctx }) => {
      return ctx.db.transaction(async (trx) => {
        const businessTypes = await trx
          .select({
            businessType: customers.businessType,
          })
          .from(customers)
          .where(isNotNull(customers.businessType))
          .groupBy(customers.businessType);
        return businessTypes.map((str) => str.businessType as string);
      });
    }),
  getBanks: protectedProcedure
    .output(z.array(baseBankAccount.shape.bank))
    .query(async ({ ctx }) => {
      return ctx.db.transaction(async (trx) => {
        const banks = await trx
          .select({
            bank: customerBankAccounts.bank,
          })
          .from(customerBankAccounts)
          .where(isNotNull(customerBankAccounts.bank))
          .groupBy(customerBankAccounts.bank);
        return banks.map((str) => str.bank as string);
      });
    }),
  getBankAccountTypes: protectedProcedure
    .output(z.array(baseBankAccount.shape.accountType))
    .query(async ({ ctx }) => {
      return ctx.db.transaction(async (trx) => {
        const accountTypes = await trx
          .select({
            accountType: customerBankAccounts.accountType,
          })
          .from(customerBankAccounts)
          .where(isNotNull(customerBankAccounts.accountType))
          .groupBy(customerBankAccounts.accountType);
        return accountTypes.map((str) => str.accountType as string);
      });
    }),
});
