import cuid from "@common/cuid";
import { isNull } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";

export const userLanguageEnum = pgEnum("user_language", ["EN", "AR"]);
export type UserLanguage = (typeof userLanguageEnum.enumValues)[number];

export const usersTable = pgTable(
  "users",
  {
    id: cuid().primaryKey(),
    name: text().notNull(),
    email: text().notNull(),
    passwordHash: text().notNull(),
    isVerified: boolean().notNull().default(false),
    isSuperAdmin: boolean().notNull().default(false),
    profileImageURL: text(),
    timezone: text().notNull().default("UTC"),
    language: userLanguageEnum().notNull().default("EN"),
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
