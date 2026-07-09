import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().trim(),
  email: z.email().trim(),
  password: z.string().min(8),
  age: z.number().int().min(13).max(120)
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export const UpdateUserSchema = z.object({
  name: z.string().trim().optional(),
  age: z.number().int().min(13).max(120).optional()
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
