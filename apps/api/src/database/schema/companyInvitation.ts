import cuid from "@common/cuid";
import { companyTable } from "@schema/company";
import { companyMembershipRoleEnum } from "@schema/companyMembership";
import { usersTable } from "@schema/users";
import { eq, sql } from "drizzle-orm";
import { pgTable, text, pgEnum, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const companyInvitationStatusEnum = pgEnum("company_invitation_status", ["PENDING", "ACCEPTED", "REVOKED", "EXPIRED"]);
export type CompanyInvitationStatus = (typeof companyInvitationStatusEnum.enumValues)[number];

export const companyInvitationTable = pgTable(
  "company_invitation",
  {
    id: cuid().primaryKey(),
    companyId: text()
      .notNull()
      .references(() => companyTable.id, { onDelete: "cascade" }),
    email: text().notNull(),
    role: companyMembershipRoleEnum().notNull().default("COMPANY_USER"),
    status: companyInvitationStatusEnum().notNull().default("PENDING"),
    token: text().notNull(),
    invitedBy: text().references(() => usersTable.id, { onDelete: "set null" }),
    expiresAt: timestamp().notNull(),
    acceptedAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("company_invitation_company_email_pending_unique").on(table.companyId, table.email).where(eq(table.status, sql.raw("'PENDING'"))),
    uniqueIndex("company_invitation_token_unique").on(table.token)
  ]
);

export type CompanyInvitation = typeof companyInvitationTable.$inferSelect;
export type CompanyInvitationInsert = typeof companyInvitationTable.$inferInsert;
