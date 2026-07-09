import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
