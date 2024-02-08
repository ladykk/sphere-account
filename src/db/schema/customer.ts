import { sql } from "drizzle-orm";
import { timestamp, pgTable, text, boolean, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const customers = pgTable("customer", {
  id: uuid("id").notNull().primaryKey(),
  // Information
  name: text("name").notNull(),
  taxId: text("tax_id"),
  address: text("address"),
  shipping_address: text("shipping_address"),
  zipcode: text("zipcode"),
  isBranch: boolean("is_branch").notNull().default(false),
  branchCode: text("branch_code"),
  branchName: text("branch_name"),
  businessType: text("business_type"),
  email: text("email"),
  telephoneNumber: text("telephone_number"),
  phoneNumber: text("phone_number"),
  faxNumber: text("fax_number"),
  website: text("website"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  //   contact_type: text("contact_type"),
  //   credit_date: date("credit_date"),
});

export const customerContacts = pgTable("customer_contacts", {
  id: uuid("id").notNull().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, {
      onDelete: "cascade",
    }),
  contactName: text("contact_name").notNull(),
  email: text("email"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const customerBankAccounts = pgTable("customer_bank_accounts", {
  id: uuid("id").notNull().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, {
      onDelete: "cascade",
    }),
  bank: text("bank").notNull(),
  accountNumber: text("account_number").notNull(),
  bankBranch: text("bank_branch").notNull(),
  accountType: text("account_type").notNull(),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

// TODO: Attachment Table
