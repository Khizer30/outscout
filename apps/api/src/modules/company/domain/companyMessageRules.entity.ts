import { createId } from "@paralleldrive/cuid2";

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

export class CompanyMessageRulesEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly channel: MessageChannel,
    public readonly rules: string | null,
    public readonly greeting: string | null,
    public readonly version: number,
    public readonly updatedBy: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(props: {
    id?: string;
    companyId: string;
    channel: MessageChannel;
    rules?: string | null;
    greeting?: string | null;
    version?: number;
    updatedBy?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): CompanyMessageRulesEntity {
    return new CompanyMessageRulesEntity(
      props.id ?? createId(),
      props.companyId,
      props.channel,
      props.rules ?? null,
      props.greeting ?? null,
      props.version ?? 1,
      props.updatedBy ?? null,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date()
    );
  }

  update(props: { rules?: string | null; greeting?: string | null; updatedBy?: string | null }): CompanyMessageRulesEntity {
    return new CompanyMessageRulesEntity(
      this.id,
      this.companyId,
      this.channel,
      props.rules !== undefined ? props.rules : this.rules,
      props.greeting !== undefined ? props.greeting : this.greeting,
      this.version + 1,
      props.updatedBy !== undefined ? props.updatedBy : this.updatedBy,
      this.createdAt,
      new Date()
    );
  }
}
