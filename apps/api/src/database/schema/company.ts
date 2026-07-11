import cuid from "@common/cuid";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const companyTable = pgTable("company", {
  id: cuid().primaryKey(),
  name: text().notNull(),
  about: text(),
  companyImageURL: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp()
});

export type Company = typeof companyTable.$inferSelect;
export type CompanyInsert = typeof companyTable.$inferInsert;
