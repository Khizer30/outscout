import { AppError } from "@common/app.error";

export class UserNotFoundError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("USER_NOT_FOUND", "User not found", details, 404);
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("USER_ALREADY_EXISTS", "User already exists", details, 409);
  }
}
