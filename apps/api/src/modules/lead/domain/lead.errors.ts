import { AppError } from "@common/app.error";

export class LeadNotFoundError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("LEAD_NOT_FOUND", "Lead not found", details, 404);
  }
}

export class LeadAccessDeniedError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("LEAD_ACCESS_DENIED", "You do not have access to this lead", details, 403);
  }
}

export class LeadNotEnrichingError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("LEAD_NOT_ENRICHING", "Lead must be in ENRICHING status to be processed by AI", details, 409);
  }
}
