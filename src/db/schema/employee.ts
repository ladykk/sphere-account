import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { files } from "./file";

export const employees = pgTable("employee", {
  id: uuid("id").notNull().primaryKey(),
  // Information
  saleNo: text("sale_no").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phoneNumber: text("phone_number"),
  image: text("image").references(() => files.id, {
    onDelete: "set null",
  }),
  // Metadata
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
