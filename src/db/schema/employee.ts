import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { files } from "./file";

export const employees = pgTable("employee", {
  id: uuid("id").notNull().primaryKey(),
  // Information
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  phoneNumber: text("phoneNumber"),
  image: text("image").references(() => files.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  // Metadata
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
