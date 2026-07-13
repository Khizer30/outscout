import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  isVerified: z.boolean(),
  isSuperAdmin: z.boolean(),
  profileImageURL: z.string().nullable(),
  timezone: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
