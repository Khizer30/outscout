import cuid from "@common/cuid";
import { companyTable } from "@schema/company";
import { companyMessageRulesTable } from "@schema/companyMessageRules";
import { leadsTable } from "@schema/leads";
import { usersTable } from "@schema/users";
import { pgTable, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";

export type AiGeneratedMessageData =
  | { channel: "WHATSAPP"; greetings: string; opening: string; body: string; callToAction: string }
  | { channel: "EMAIL"; subject: string; opening: string; body: string; callToAction: string; signOff: string };

export const aiGeneratedMessagesTable = pgTable(
  "ai_generated_messages",
  {
    id: cuid().primaryKey(),
    leadId: text()
      .notNull()
      .references(() => leadsTable.id, { onDelete: "cascade" }),
    companyId: text()
      .notNull()
      .references(() => companyTable.id, { onDelete: "cascade" }),
    companyMessageRulesId: text().references(() => companyMessageRulesTable.id, { onDelete: "set null" }),
    companyMessageRulesVersion: integer(),
    data: jsonb().$type<AiGeneratedMessageData>().notNull(),
    createdBy: text().references(() => usersTable.id, { onDelete: "set null" }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => [index("ai_generated_messages_lead_id_idx").on(table.leadId), index("ai_generated_messages_company_id_idx").on(table.companyId)]
);

export type AiGeneratedMessage = typeof aiGeneratedMessagesTable.$inferSelect;
export type AiGeneratedMessageInsert = typeof aiGeneratedMessagesTable.$inferInsert;
