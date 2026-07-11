import cuid from "@common/cuid";
import { usersTable } from "@schema/users";
import { pgTable, text, pgEnum, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const verificationTypeEnum = pgEnum("verification_type", ["VERIFY", "RESET"]);
export type VerificationType = (typeof verificationTypeEnum.enumValues)[number];

export const verificationsTable = pgTable(
  "verifications",
  {
    id: cuid().primaryKey(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: verificationTypeEnum().notNull(),
    otp: text().notNull(),
    expiresAt: timestamp().notNull(),
    used: boolean().notNull().default(false),
    createdAt: timestamp().defaultNow().notNull()
  },
  (table) => [
    index("verifications_user_id_idx").on(table.userId),
    index("verifications_otp_idx").on(table.otp),
    index("verifications_expires_at_idx").on(table.expiresAt),
    index("verifications_used_idx").on(table.used)
  ]
);

export type Verification = typeof verificationsTable.$inferSelect;
export type VerificationInsert = typeof verificationsTable.$inferInsert;
