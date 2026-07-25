import { AppError } from "@common/app.error";

export class LeadNotFoundError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("LEAD_NOT_FOUND", "Lead not found", details, 404);
  }
}
