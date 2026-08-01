import { AppError } from "@common/app.error";

export class AiGenerationFailedError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("AI_GENERATION_FAILED", "Failed to generate AI response", details, 502);
  }
}

export class AiGeneratedMessageNotFoundError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("AI_GENERATED_MESSAGE_NOT_FOUND", "AI generated message not found", details, 404);
  }
}

export class AiGeneratedMessageAccessDeniedError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("AI_GENERATED_MESSAGE_ACCESS_DENIED", "You do not have access to this AI generated message", details, 403);
  }
}

export class InvalidMessagePartError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("INVALID_MESSAGE_PART", "The given message part is not valid for this message's channel", details, 400);
  }
}

export class AiGeneratedMessageChannelMismatchError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("AI_GENERATED_MESSAGE_CHANNEL_MISMATCH", "This AI generated message is not for the expected channel", details, 400);
  }
}
