import { GeneratedMessage } from "@modules/ai/domain/ai.types";
import { createId } from "@paralleldrive/cuid2";

export class AiGeneratedMessageEntity {
  constructor(
    public readonly id: string,
    public readonly leadId: string,
    public readonly companyId: string,
    public readonly companyMessageRulesId: string | null,
    public readonly companyMessageRulesVersion: number | null,
    public readonly data: GeneratedMessage,
    public readonly createdBy: string | null,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    id?: string;
    leadId: string;
    companyId: string;
    companyMessageRulesId?: string | null;
    companyMessageRulesVersion?: number | null;
    data: GeneratedMessage;
    createdBy?: string | null;
    createdAt?: Date;
  }): AiGeneratedMessageEntity {
    return new AiGeneratedMessageEntity(
      props.id ?? createId(),
      props.leadId,
      props.companyId,
      props.companyMessageRulesId ?? null,
      props.companyMessageRulesVersion ?? null,
      props.data,
      props.createdBy ?? null,
      props.createdAt ?? new Date()
    );
  }
}
