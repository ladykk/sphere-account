
import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    boolean,
    date,
} from "drizzle-orm/pg-core";


export const projects = pgTable("project", {
    project_name: text("project_name").notNull().primaryKey(),
    customer_id: text("customer_id"), //identifier
    ref_quotation_id: text("ref_quotation_id"),//identifier
    price: integer("price"),
    detail: text("detail"),
    create_by: text("create_by"),
    create_on: timestamp("create_on", { mode: "date" }),
    update_by: text("update_by"),
    update_on: timestamp("update_on", { mode: "date" })
})