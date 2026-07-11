import { companyTable } from "@schema/company";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const companyEmailSettingsTable = pgTable("company_email_settings", {
  companyId: text()
    .primaryKey()
    .references(() => companyTable.id, { onDelete: "cascade" }),
  brevoApiKeyCipher: text(),
  fromEmail: text(),
  emailSignature: text(),
  primaryColor: text(),
  secondaryColor: text(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
});

export type CompanyEmailSettings = typeof companyEmailSettingsTable.$inferSelect;
export type CompanyEmailSettingsInsert = typeof companyEmailSettingsTable.$inferInsert;
