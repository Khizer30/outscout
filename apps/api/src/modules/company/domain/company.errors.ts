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
