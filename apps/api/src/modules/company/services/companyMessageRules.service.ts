import { AuditService } from "@modules/audit/services/audit.service";
import { CompanyMessageRulesEntity } from "@modules/company/domain/companyMessageRules.entity";
import { CompanyMessageRulesRepository } from "@modules/company/domain/companyMessageRules.repository";
import { MessageChannel } from "@modules/company/domain/companyMessageRules.types";
import { Injectable } from "@nestjs/common";

interface UpdateCompanyMessageRulesData {
  rules?: string | null;
  greeting?: string | null;
}

@Injectable()
export class CompanyMessageRulesService {
  constructor(
    private readonly companyMessageRulesRepo: CompanyMessageRulesRepository,
    private readonly auditService: AuditService
  ) {}

  async findByCompanyAndChannel(companyId: string, channel: MessageChannel): Promise<CompanyMessageRulesEntity | null> {
    return this.companyMessageRulesRepo.findByCompanyAndChannel(companyId, channel);
  }

  async updateRules(companyId: string, channel: MessageChannel, data: UpdateCompanyMessageRulesData, updatedBy: string): Promise<CompanyMessageRulesEntity> {
    const existing = await this.companyMessageRulesRepo.findByCompanyAndChannel(companyId, channel);

    const entity = existing ? existing.update({ ...data, updatedBy }) : CompanyMessageRulesEntity.create({ companyId, channel, ...data, updatedBy });

    const saved = await this.companyMessageRulesRepo.upsert(entity, existing);

    await this.auditService.log({ action: existing ? "RULE_UPDATED" : "RULE_CREATED", actorId: updatedBy, companyId });

    return saved;
  }
}
