import { CompanyMessageRulesEntity } from "@modules/company/domain/companyMessageRules.entity";
import { MessageChannel } from "@modules/company/domain/companyMessageRules.types";

export abstract class CompanyMessageRulesRepository {
  abstract findByCompanyAndChannel(companyId: string, channel: MessageChannel): Promise<CompanyMessageRulesEntity | null>;
  abstract upsert(entity: CompanyMessageRulesEntity, previous: CompanyMessageRulesEntity | null): Promise<CompanyMessageRulesEntity>;
}
