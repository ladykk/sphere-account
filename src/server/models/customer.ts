import { z } from "zod";
import { paginateInputSchema, paginateOutputSchema } from ".";
import { contactTypeEnum, customerAttachmentType } from "@/db/schema/customer";

const baseContact = z.object({
  id: z
    .string()
    .min(1, "Customer Contact ID Required")
    .uuid("Invalid Customer Contact ID"),
  customerId: z
    .string()
    .min(1, "Customer ID Required")
    .uuid("Invalid Customer ID"),
  contactName: z.string().min(1, "Contact Name Required"),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  createdBy: z.string().nullable(),
  updatedAt: z.date(),
  updatedBy: z.string().nullable(),
});

export const baseBankAccount = z.object({
  id: z
    .string()
    .min(1, "Customer Bank Account ID Required")
    .uuid("Invalid Customer Bank Account ID"),
  customerId: z
    .string()
    .min(1, "Customer ID Required")
    .uuid("Invalid Customer ID"),
  bank: z.string().min(1, "Bank Required"),
  accountNumber: z.string().min(1, "Account Number Required"),
  bankBranch: z.string().min(1, "Bank Branch Required"),
  accountType: z.string().min(1, "Account Type Required"),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  createdBy: z.string().nullable(),
  updatedAt: z.date(),
  updatedBy: z.string().nullable(),
});

export const baseAttachment = z.object({
  id: z
    .string()
    .min(1, "Customer Attachment ID Required")
    .uuid("Invalid Customer Attachment ID"),
  customerId: z
    .string()
    .min(1, "Customer ID Required")
    .uuid("Invalid Customer ID"),
  fileId: z.string().min(1, "File ID Required").uuid("Invalid File ID"),
  fileName: z.string().min(1, "File Name Required"),
  fileSize: z.number().min(1, "File Size Required"),
  fileCategory: z.enum(customerAttachmentType.enumValues),
  uploadedBy: z.string().nullable(),
  uploadedAt: z.date(),
});

const base = z.object({
  id: z.string().min(1, "Customer ID Required").uuid("Invalid Customer ID"),
  code: z.string().min(1, "Code Required"),
  name: z.string().min(1, "Name Required"),
  type: z.enum(contactTypeEnum.enumValues).default("person"),
  taxId: z.string().nullable(),
  address: z.string().nullable(),
  zipcode: z.string().nullable(),
  shippingAddress: z.string().nullable(),
  shippingZipcode: z.string().nullable(),
  isBranch: z.boolean().default(false),
  branchCode: z.string().nullable(),
  branchName: z.string().nullable(),
  businessType: z.string().nullable(),
  email: z.string().nullable(),
  telephoneNumber: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  faxNumber: z.string().nullable(),
  website: z.string().nullable(),
  creditDate: z.number().nullable(),
  notes: z.string().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  createdBy: z.string().nullable(),
  updatedAt: z.date(),
  updatedBy: z.string().nullable(),
  // Relation Context
  contacts: z.array(baseContact),
  bankAccounts: z.array(baseBankAccount),
  attachments: z.array(baseAttachment),
});

export const customerContactInput = baseContact
  .omit({
    id: true,
    customerId: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
  })
  .extend({
    id: baseContact.shape.id.optional(),
  });

const customerAccountInput = baseBankAccount
  .omit({
    id: true,
    customerId: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
  })
  .extend({
    id: baseBankAccount.shape.id.optional(),
  });

export const customerAttachmentInput = baseAttachment
  .omit({
    id: true,
    customerId: true,
    fileName: true,
    fileSize: true,
    uploadedAt: true,
    uploadedBy: true,
  })
  .extend({
    id: baseAttachment.shape.id.optional(),
  });

export const formInput = base
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
    contacts: true,
    bankAccounts: true,
  })
  .extend({
    id: z.string().uuid("Invalid uuid").optional(),
    contacts: z.array(customerContactInput),
    bankAccounts: z.array(customerAccountInput),
  });

export const Customer = {
  schemas: {
    base: base,
    paginateInput: paginateInputSchema({
      keyword: z.string().optional(),
      customerId: z.string().uuid("Invalid uuid").optional(),
    }),
    paginateOutput: paginateOutputSchema(base),
    formInput,
    formOutput: base.shape.id,
  },
};
