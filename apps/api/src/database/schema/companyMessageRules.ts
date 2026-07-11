import cuid from "@common/cuid";
import { companyTable } from "@schema/company";
import { usersTable } from "@schema/users";
import { pgTable, text, pgEnum, timestamp, uniqueIndex, integer } from "drizzle-orm/pg-core";

export const messageChannelEnum = pgEnum("message_channel", ["WHATSAPP", "EMAIL"]);
export type MessageChannel = (typeof messageChannelEnum.enumValues)[number];

export const companyMessageRulesTable = pgTable(
  "company_message_rules",
  {
    id: cuid().primaryKey(),
    companyId: text()
      .notNull()
      .references(() => companyTable.id, { onDelete: "cascade" }),
    channel: messageChannelEnum().notNull(),
    rules: text(),
    greeting: text(),
    version: integer().notNull().default(1),
    updatedBy: text().references(() => usersTable.id, { onDelete: "set null" }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => [uniqueIndex("company_message_rules_company_channel_unique").on(table.companyId, table.channel)]
);

export type CompanyMessageRules = typeof companyMessageRulesTable.$inferSelect;
export type CompanyMessageRulesInsert = typeof companyMessageRulesTable.$inferInsert;
