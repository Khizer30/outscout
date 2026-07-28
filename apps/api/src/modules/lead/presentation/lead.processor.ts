import { LeadService } from "@modules/lead/services/lead.service";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";

type ProcessLeadJobData = {
  leadId: string;
  companyId: string;
};

@Processor("webScraper")
export class LeadProcessor extends WorkerHost {
  private readonly logger = new Logger(LeadProcessor.name);

  constructor(private readonly leadService: LeadService) {
    super();
  }

  async process(job: Job<ProcessLeadJobData>): Promise<void> {
    if (job.name !== "processLead") {
      return;
    }

    const { leadId, companyId } = job.data;

    this.logger.log(`Processing lead ${leadId} for company ${companyId}`);

    await this.leadService.processLead(leadId, companyId);
  }
}
