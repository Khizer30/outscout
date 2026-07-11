import cuid from "@common/cuid";
import { companyTable } from "@schema/company";
import { usersTable } from "@schema/users";
import { pgTable, text, pgEnum, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const companyMembershipRoleEnum = pgEnum("company_membership_role", ["COMPANY_ADMIN", "COMPANY_USER"]);
export type CompanyMembershipRole = (typeof companyMembershipRoleEnum.enumValues)[number];

export const companyMembershipStatusEnum = pgEnum("company_membership_status", ["ACTIVE", "INACTIVE"]);
export type CompanyMembershipStatus = (typeof companyMembershipStatusEnum.enumValues)[number];

export const companyMembershipTable = pgTable(
  "company_membership",
  {
    id: cuid().primaryKey(),
    companyId: text()
      .notNull()
      .references(() => companyTable.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    role: companyMembershipRoleEnum().notNull().default("COMPANY_USER"),
    status: companyMembershipStatusEnum().notNull().default("ACTIVE"),
    joinedAt: timestamp().defaultNow().notNull()
  },
  (table) => [uniqueIndex("company_membership_company_user_unique").on(table.companyId, table.userId)]
);

export type CompanyMembership = typeof companyMembershipTable.$inferSelect;
export type CompanyMembershipInsert = typeof companyMembershipTable.$inferInsert;
