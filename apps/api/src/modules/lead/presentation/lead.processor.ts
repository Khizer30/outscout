import { LeadMapper } from "@modules/lead/infrastructure/lead.mapper";
import { LeadService } from "@modules/lead/services/lead.service";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { RedisService } from "@redis/services/redis.service";
import { Job } from "bullmq";

type ProcessLeadJobData = {
  leadId: string;
  companyId: string;
};

@Processor("webScraper")
export class LeadProcessor extends WorkerHost {
  private readonly logger = new Logger(LeadProcessor.name);

  constructor(
    private readonly leadService: LeadService,
    private readonly redisService: RedisService
  ) {
    super();
  }

  async process(job: Job<ProcessLeadJobData>): Promise<void> {
    if (job.name !== "processLead") {
      return;
    }

    const { leadId, companyId } = job.data;

    this.logger.log(`Processing lead ${leadId} for company ${companyId}`);

    const lead = await this.leadService.processLead(leadId, companyId);

    await this.redisService.publish(`leads:${companyId}`, JSON.stringify({ jobId: job.id, data: LeadMapper.toResponse(lead) }));
  }
}
