import {
  timestamp,
  pgTable,
  text,
  integer,
  numeric,
} from "drizzle-orm/pg-core";

export const products = pgTable("product", {
  product_number: text("product_number").notNull().primaryKey(),
  product_type: text("product_type"),
  product_name: text("product_name"),
  // product_img: text("product_img"), //image
  product_code: text("product_code"),
  category: text("category"),
  main_unit: text("main_unit"),
  barcode: text("barcode"),
  selling_price: numeric("selling_price"),
  vat: integer("vat"),
  product_description: text("product_description"),
  income_account: text("income_account"),
  quantity: integer("quantity"),
  unit: text("unit"),
  create_by: text("create_by"),
  create_on: timestamp("create_on", { mode: "date" }),
  update_by: text("update_by"),
  update_on: timestamp("update_on", { mode: "date" }),
});
