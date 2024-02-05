import { z } from "zod"

export const Customer = {
    schemas: {
        createCustomerInput: z.object({
            id: z.string().min(1, "Require Customer's id").uuid("Invalid uuid"),
            name: z.string().min(1, "Require Customer's name"),
            taxId: z.string().nullable().default(""),
            address: z.string().nullable().default(""),
            shipping_address: z.string().nullable().default(""),
            zipcode: z.string().nullable().default(""),
            isBranch: z.boolean({
                required_error: "isBranch is required",
                invalid_type_error: "isBranch must be a boolean",
            }),
            branchCode: z.string().nullable().default(""),
            branchName: z.string().nullable().default(""),
            businessType: z.string().nullable().default(""),
            email: z.string().nullable().default(""),
            telelphoneNumber: z.string().nullable().default(""),
            phoneNumber: z.string().nullable().default(""),
            faxNumber: z.string().nullable().default(""),
            website: z.string().nullable().default(""),
            notes: z.string().nullable().default(""),
            createdAt: z.date(),
            createdBy: z.string().nullable(),
            updatedAt: z.date(),
            updatedBy: z.string().nullable(),
        }),

        createCustomerOutputSchema: z.object({
            id: z.string()
        }),

        createCustomerContactInput: z.object({
            id: z.string().min(1, "Require Customer Contact's id").uuid("Invalid uuid"),
            customerId: z.string().min(1, "Require customerId").uuid("Invalid uuid"),
            contactName: z.string().min(1, "Require Contact's name"),
            email: z.string().nullable().default(""),
            phoneNumber: z.string().nullable().default(""),
            createdAt: z.date(),
            createdBy: z.string().nullable(),
            updatedAt: z.date(),
            updatedBy: z.string().nullable(),
        }),

        createCustomerContactOutput: z.object({
            id: z.string()
        }),

        getCustomerContactInput: z.object({
            id: z.string().min(1, "Require Customer's id").uuid("Invalid uuid"),
        }),

        createCustomerBankAccountsInput: z.object({
            id: z.string().min(1, "Require project's id").uuid("Invalid uuid"),
            customerId: z.string().min(1, "Require customerId").uuid("Invalid uuid"),
            bank: z.string(),
            accountNumber: z.string(),
            bankBranch: z.string(),
            accountType: z.string(),
            createdAt: z.date(),
            createdBy: z.string().nullable(),
            updatedAt: z.date(),
            updatedBy: z.string().nullable(),
        }),

        createCustomerBankAccountsOutput: z.object({
            id: z.string(),
        }),

        
    }
}