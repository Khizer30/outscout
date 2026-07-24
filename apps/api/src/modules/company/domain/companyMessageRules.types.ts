export type MessageChannel = "WHATSAPP" | "EMAIL";

export interface CompanyMessageRulesRecord {
  id: string;
  companyId: string;
  channel: MessageChannel;
  rules: string | null;
  greeting: string | null;
  version: number;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyMessageRulesHistoryRecord {
  companyMessageRulesId: string;
  companyId: string;
  channel: MessageChannel;
  version: number;
  rules: string | null;
  greeting: string | null;
  changedAt: Date;
}
