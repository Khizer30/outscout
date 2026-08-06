import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const MessagePartSchema = z.enum(["subject", "greetings", "opening", "body", "callToAction", "signOff"]);

export const RewriteOutreachMessageSchema = z.object({
  prompt: z.string().min(1, { error: "Prompt is required" }),
  messagePart: MessagePartSchema.optional()
});

export class RewriteOutreachMessageDto extends createZodDto(RewriteOutreachMessageSchema) {}
