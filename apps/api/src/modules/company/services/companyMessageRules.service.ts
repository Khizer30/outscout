import { CompanyMessageRulesEntity, MessageChannel } from "@modules/company/domain/companyMessageRules.entity";
import { CompanyMessageRulesRepository } from "@modules/company/domain/companyMessageRules.repository";
import { Injectable } from "@nestjs/common";

interface UpdateCompanyMessageRulesData {
  rules?: string | null;
  greeting?: string | null;
}

@Injectable()
export class CompanyMessageRulesService {
  constructor(private readonly companyMessageRulesRepo: CompanyMessageRulesRepository) {}

  async updateRules(companyId: string, channel: MessageChannel, data: UpdateCompanyMessageRulesData, updatedBy: string): Promise<CompanyMessageRulesEntity> {
    const existing = await this.companyMessageRulesRepo.findByCompanyAndChannel(companyId, channel);

    const entity = existing ? existing.update({ ...data, updatedBy }) : CompanyMessageRulesEntity.create({ companyId, channel, ...data, updatedBy });

    return this.companyMessageRulesRepo.upsert(entity, existing);
  }
}
