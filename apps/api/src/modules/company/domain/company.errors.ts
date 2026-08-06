import { AppError } from "@common/app.error";

export class CompanyNotFoundError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("COMPANY_NOT_FOUND", "Company not found", details, 404);
  }
}

export class UserAlreadyHasCompanyError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("USER_ALREADY_HAS_COMPANY", "User is already associated with a company", details, 400);
  }
}

export class CompanyMembershipNotFoundError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("COMPANY_MEMBERSHIP_NOT_FOUND", "Active company membership not found", details, 404);
  }
}

export class CompanyUpdateConflictError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("COMPANY_UPDATE_CONFLICT", "Company was deleted or modified before the update could be applied", details, 409);
  }
}

export class CompanyEmailNotConfiguredError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("COMPANY_EMAIL_NOT_CONFIGURED", "Company has not configured a Brevo email account", details, 409);
  }
}
