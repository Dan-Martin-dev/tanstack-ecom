import { createServerOnlyFn } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env/server";

import * as schema from "~/lib/db/schema";

// Configure connection with pooling
const driver = postgres(env.DATABASE_URL, {
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
});

const getDatabase = createServerOnlyFn(() =>
  drizzle({ client: driver, schema, casing: "snake_case" }),
);

export const db = getDatabase();
