import { CompanyMessageRulesEntity, MessageChannel } from "@modules/company/domain/companyMessageRules.entity";

export abstract class CompanyMessageRulesRepository {
  abstract findByCompanyAndChannel(companyId: string, channel: MessageChannel): Promise<CompanyMessageRulesEntity | null>;
  abstract upsert(entity: CompanyMessageRulesEntity, previous: CompanyMessageRulesEntity | null): Promise<CompanyMessageRulesEntity>;
}
