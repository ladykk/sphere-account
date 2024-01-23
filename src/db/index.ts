import { getPoolDBUrl } from "@/env/server.mjs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import schema from "./schema";

const queryClient = postgres(getPoolDBUrl());
const db = drizzle(queryClient, {
  schema,
});

export default db;
