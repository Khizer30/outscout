import { AppError } from "@common/app.error";

export class AiGenerationFailedError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("AI_GENERATION_FAILED", "Failed to generate AI response", details, 502);
  }
}
