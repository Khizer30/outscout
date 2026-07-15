import { AppError } from "@common/app.error";

export class InvalidOtpError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("INVALID_OTP", "Invalid OTP code", details, 400);
  }
}

export class ExpiredOtpError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("EXPIRED_OTP", "OTP code has expired", details, 400);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("INVALID_CREDENTIALS", "Invalid email or password", details, 401);
  }
}

export class UserNotVerifiedError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("USER_NOT_VERIFIED", "Please verify your email first", details, 403);
  }
}
