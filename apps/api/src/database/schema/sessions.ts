import cuid from "@common/cuid";
import { usersTable } from "@schema/users";
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";

export const sessionsTable = pgTable(
  "sessions",
  {
    id: cuid().primaryKey(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    refreshTokenHash: text().notNull(),
    ipAddress: text().notNull(),
    expiryTime: timestamp().notNull(),
    createdAt: timestamp().defaultNow().notNull()
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_refresh_token_hash_idx").on(table.refreshTokenHash),
    index("sessions_expiry_time_idx").on(table.expiryTime)
  ]
);

export type Session = typeof sessionsTable.$inferSelect;
export type SessionInsert = typeof sessionsTable.$inferInsert;
