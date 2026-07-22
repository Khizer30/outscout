import { AppError } from "@common/app.error";

export class InvitationNotFoundError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("INVITATION_NOT_FOUND", "Invitation not found", details, 404);
  }
}

export class InvitationExpiredError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("INVITATION_EXPIRED", "This invitation has expired", details, 400);
  }
}

export class InvitationAlreadyProcessedError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("INVITATION_ALREADY_PROCESSED", "This invitation has already been accepted or is no longer valid", details, 409);
  }
}

export class InvitationPendingExistsError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("INVITATION_PENDING_EXISTS", "An active invitation already exists for this email", details, 409);
  }
}

export class InvitationEmailMismatchError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("INVITATION_EMAIL_MISMATCH", "This invitation was sent to a different email address", details, 403);
  }
}

export class InvitationTokenInvalidError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("INVITATION_TOKEN_INVALID", "Invalid or expired invitation link", details, 400);
  }
}

export class UserAlreadyCompanyMemberError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("USER_ALREADY_COMPANY_MEMBER", "User is already a member of this company", details, 409);
  }
}
