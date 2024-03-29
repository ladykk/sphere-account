import {
  timestamp,
  pgTable,
  text,
  integer,
  numeric,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./auth";
import { files } from "./file";

export const products = pgTable("product", {
  id: uuid("id").notNull().primaryKey(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  // product_img: text("product_img"), // TODO: File implementation
  code: text("code").notNull(),
  category: text("category").notNull(),
  barcode: text("barcode"),
  sellingPrice: numeric("selling_price").notNull().default("0.00"),
  vatType: text("vat_type"),
  description: text("description"),
  stock: integer("stock").notNull().default(0),
  unit: text("main_unit").notNull().default("Unit"),
  image: text("image").references(() => files.id, {
    onDelete: "set null",
  }),
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
