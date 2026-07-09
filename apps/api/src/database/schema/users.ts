import cuid from "@common/cuid";
import { isNull } from "drizzle-orm";
import { pgTable, text, pgEnum, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export type Role = (typeof roleEnum.enumValues)[number];

export const usersTable = pgTable(
  "users",
  {
    id: cuid().primaryKey(),
    name: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
    role: roleEnum().notNull().default("USER"),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp()
  },
  (table) => [uniqueIndex("users_email_active_unique").on(table.email).where(isNull(table.deletedAt))]
);

export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
