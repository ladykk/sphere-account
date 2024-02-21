import {
  timestamp,
  pgTable,
  text,
  integer,
  numeric,
  uuid,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { files } from "./file";

export const productTypeEnum = pgEnum("product_type", ["stock", "service"]);
export const vatTypeEnum = pgEnum("vat_type", ["include", "exclude", "exempt"]);

export const products = pgTable("product", {
  id: uuid("id").notNull().primaryKey(),
  type: productTypeEnum("type").notNull(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  category: text("category").notNull(),
  barcode: text("barcode"),
  sellingPrice: numeric("sellingPrice").notNull().default("0.00"),
  vatType: vatTypeEnum("vatType").notNull().default("exclude"),
  description: text("description"),
  stock: integer("stock").notNull().default(0),
  unit: text("unit").notNull().default("Unit"),
  image: text("image").references(() => files.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
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
