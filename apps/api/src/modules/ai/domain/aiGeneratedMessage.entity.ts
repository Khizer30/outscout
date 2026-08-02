import { GeneratedMessage } from "@modules/ai/domain/ai.types";
import { createId } from "@paralleldrive/cuid2";

export class AiGeneratedMessageEntity {
  constructor(
    public readonly id: string,
    public readonly leadId: string,
    public readonly leadCreatedAt: Date,
    public readonly companyId: string,
    public readonly companyMessageRulesId: string | null,
    public readonly companyMessageRulesVersion: number | null,
    public readonly data: GeneratedMessage,
    public readonly createdBy: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(props: {
    id?: string;
    leadId: string;
    leadCreatedAt: Date;
    companyId: string;
    companyMessageRulesId?: string | null;
    companyMessageRulesVersion?: number | null;
    data: GeneratedMessage;
    createdBy?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): AiGeneratedMessageEntity {
    return new AiGeneratedMessageEntity(
      props.id ?? createId(),
      props.leadId,
      props.leadCreatedAt,
      props.companyId,
      props.companyMessageRulesId ?? null,
      props.companyMessageRulesVersion ?? null,
      props.data,
      props.createdBy ?? null,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date()
    );
  }
}
