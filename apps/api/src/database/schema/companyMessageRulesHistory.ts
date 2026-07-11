import cuid from "@common/cuid";
import { companyTable } from "@schema/company";
import { companyMessageRulesTable, messageChannelEnum } from "@schema/companyMessageRules";
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const companyMessageRulesHistoryTable = pgTable("company_message_rules_history", {
  id: cuid().primaryKey(),
  companyMessageRulesId: text()
    .notNull()
    .references(() => companyMessageRulesTable.id, { onDelete: "cascade" }),
  companyId: text()
    .notNull()
    .references(() => companyTable.id, { onDelete: "cascade" }),
  channel: messageChannelEnum().notNull(),
  version: integer().notNull(),
  rules: text(),
  greeting: text(),
  changedAt: timestamp().defaultNow().notNull()
});

export type CompanyMessageRulesHistory = typeof companyMessageRulesHistoryTable.$inferSelect;
export type CompanyMessageRulesHistoryInsert = typeof companyMessageRulesHistoryTable.$inferInsert;
