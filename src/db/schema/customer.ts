
import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    boolean,
    date,
} from "drizzle-orm/pg-core";

export const customers = pgTable("customer", {
    id: text("id").notNull().primaryKey(),
    customer_name: text("customer_name"),
    address: text("address"),
    zipcode: text("zipcode"),
    tax_id: text("tax_id"),
    branch: boolean('branch'),
    branch_code: text("branch_code"),
    branch_name: text("branch_name"),
    business_type: text("business_type"),
    //contact_id: integer("contact_id"),
    business_name: text("business_name"),
    contact_name: text("contact_name"),
    email: text("email"),
    mobile: text("mobile"),
    bank: text("bank"),
    account_number: text("account_number"),
    bank_branch: text("bank_branch"),
    account_type: text("account_type"),
    contact_type: text("contact_type"),
    credit_date: date("credit_date"),
    phone: text("phone"),
    fax_number: text("fax_number"),
    website: text("website"),
    shipping_address: text("shipping_address"),
    //attachment: text("attachment"), //binary
    notes: text("notes"),
    create_by: text("create_by"),
    create_on: timestamp("create_on", { mode: "date" }),
    update_by: text("update_by"),
    update_on: timestamp("update_on", { mode: "date" })
})