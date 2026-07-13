import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const SignupResponseSchema = z.object({
  message: z.string()
});

export class SignupResponseDto extends createZodDto(SignupResponseSchema) {}
