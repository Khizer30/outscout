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
