import cuid from "@common/cuid";
import { companyTable } from "@schema/company";
import { pgTable, text, integer, doublePrecision, jsonb, timestamp, pgEnum, primaryKey, index } from "drizzle-orm/pg-core";

export const leadTypeEnum = pgEnum("lead_type", [
  "RESTAURANT",
  "HOTEL",
  "HOSPITAL",
  "DENTAL_CLINIC",
  "REAL_ESTATE_AGENCY",
  "ACCOUNTING",
  "GYM",
  "BEAUTY_SALON"
]);
export type LeadType = (typeof leadTypeEnum.enumValues)[number];

export const leadStatusEnum = pgEnum("lead_status", ["ENRICHING", "READY", "CONTACTED", "INTERESTED", "UNRESPONSIVE", "REJECTED"]);
export type LeadStatus = (typeof leadStatusEnum.enumValues)[number];

export type LeadSocialLinks = {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
  otherLinks: string[];
};

export const leadsTable = pgTable(
  "leads",
  {
    id: cuid().notNull(),
    companyId: text()
      .notNull()
      .references(() => companyTable.id, { onDelete: "cascade" }),
    status: leadStatusEnum().notNull().default("ENRICHING"),
    name: text(),
    description: text(),
    address: text(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    phone: text(),
    website: text(),
    businessStatus: text(),
    rating: doublePrecision(),
    userRatingCount: integer(),
    primaryType: leadTypeEnum(),
    types: leadTypeEnum().array().notNull().default([]),
    emails: text().array().notNull().default([]),
    otherPhones: text().array().notNull().default([]),
    socialLinks: jsonb().$type<LeadSocialLinks>().notNull().default({ otherLinks: [] }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => [
    primaryKey({ columns: [table.id, table.createdAt] }),
    index("leads_id_idx").on(table.id),
    index("leads_company_id_idx").on(table.companyId)
  ]
);

export type Lead = typeof leadsTable.$inferSelect;
export type LeadInsert = typeof leadsTable.$inferInsert;
