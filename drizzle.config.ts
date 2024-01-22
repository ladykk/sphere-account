import { getPoolDBUrl } from "@/env/db";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: getPoolDBUrl(),
  },
} satisfies Config;
