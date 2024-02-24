import {
  timestamp,
  pgTable,
  text,
  boolean,
  uuid,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { files } from "./file";

export const contactTypeEnum = pgEnum("contactTypeEnum", [
  "person",
  "coperate",
]);

export const customers = pgTable("customer", {
  id: uuid("id").primaryKey(),
  // Information
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  type: contactTypeEnum("type").default("person").notNull(),
  taxId: text("taxId"),
  address: text("address"),
  zipcode: text("zipcode"),
  shippingAddress: text("shippingAddress"),
  shippingZipcode: text("shippingZipcode"),
  isBranch: boolean("isBranch").notNull().default(false),
  branchCode: text("branchCode"),
  branchName: text("branchName"),
  businessType: text("businessType"),
  email: text("email"),
  telephoneNumber: text("telephoneNumber"),
  phoneNumber: text("phoneNumber"),
  faxNumber: text("faxNumber"),
  website: text("website"),
  creditDate: integer("creditDate"),
  notes: text("notes"),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  createdBy: text("createdBy").references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  updatedBy: text("updatedBy").references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
});

export const customerContacts = pgTable("customerContacts", {
  id: uuid("id").primaryKey(),
  customerId: uuid("customerId")
    .notNull()
    .references(() => customers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  contactName: text("contactName").notNull(),
  email: text("email"),
  phoneNumber: text("phoneNumber"),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  createdBy: text("createdBy").references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  updatedBy: text("updatedBy").references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
});

export const customerBankAccounts = pgTable("customerBankAccounts", {
  id: uuid("id").primaryKey(),
  customerId: uuid("customerId")
    .notNull()
    .references(() => customers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  bank: text("bank").notNull(),
  accountNumber: text("accountNumber").notNull(),
  bankBranch: text("bankBranch").notNull(),
  accountType: text("accountType").notNull(),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  createdBy: text("createdBy").references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  updatedBy: text("updatedBy").references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
});

export const customerAttachmentType = pgEnum("customerAttachmentType", [
  "infomation",
  "bankAccounts",
  "contactPersons",
  "notes",
]);

export const customerAttachments = pgTable("customerAttachments", {
  id: uuid("id").primaryKey(),
  customerId: uuid("customerId")
    .notNull()
    .references(() => customers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  fileId: text("fileId")
    .notNull()
    .references(() => files.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  category: customerAttachmentType("category").notNull(),
});
