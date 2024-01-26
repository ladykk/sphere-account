import {
  timestamp,
  pgTable,
  text,
  uuid,
  numeric,
} from "drizzle-orm/pg-core";
import { customers } from "./customer"
import { sql } from "drizzle-orm";
import { users } from "./auth";


export const projects = pgTable("project", {
  id: uuid("id").notNull().primaryKey(),
  name: text("project_name").notNull(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, {
      onDelete: "cascade",
    }),
  price: numeric("price").notNull().default("0.00"),
  detail: text("detail"),
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
})