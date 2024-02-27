import { timestamp, pgTable, text, uuid, boolean } from "drizzle-orm/pg-core";
import { customers } from "./customer";
import { users } from "./auth";

export const projects = pgTable("project", {
  id: uuid("id").notNull().primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  customerId: uuid("customerId")
    .notNull()
    .references(() => customers.id, {
      onDelete: "cascade",
    }),
  detail: text("detail"),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  createdBy: text("createdBy").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  updatedBy: text("updatedBy").references(() => users.id, {
    onDelete: "set null",
  }),
});
