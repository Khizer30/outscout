import cuid from "@common/cuid";
import { companyTable } from "@schema/company";
import { usersTable } from "@schema/users";
import { pgTable, text, pgEnum, timestamp, index } from "drizzle-orm/pg-core";

export const auditActionEnum = pgEnum("audit_action", [
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DELETED",

  "COMPANY_CREATED",
  "COMPANY_UPDATED",
  "COMPANY_DELETED",

  "EMAIL_SETTINGS_UPDATED",

  "RULE_CREATED",
  "RULE_UPDATED",
  "RULE_DELETED"
]);
export type AuditAction = (typeof auditActionEnum.enumValues)[number];

export const auditLogsTable = pgTable(
  "audit_logs",
  {
    id: cuid().primaryKey(),
    actorId: text().references(() => usersTable.id, { onDelete: "set null" }),
    companyId: text().references(() => companyTable.id, { onDelete: "set null" }),
    action: auditActionEnum().notNull(),
    createdAt: timestamp().defaultNow().notNull()
  },
  (table) => [
    index("audit_logs_actor_id_idx").on(table.actorId),
    index("audit_logs_company_id_idx").on(table.companyId),
    index("audit_logs_action_idx").on(table.action),
    index("audit_logs_created_at_idx").on(table.createdAt)
  ]
);

export type AuditLog = typeof auditLogsTable.$inferSelect;
export type AuditLogInsert = typeof auditLogsTable.$inferInsert;
