import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

const localEnv = resolve(__dirname, ".env");
config({ path: existsSync(localEnv) ? localEnv : resolve(__dirname, "../../.env") });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
