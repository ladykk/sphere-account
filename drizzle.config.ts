import { getDBUrl } from "@/env/server.mjs";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: getDBUrl(),
  },
  verbose: true,
  strict: true,
} satisfies Config;
