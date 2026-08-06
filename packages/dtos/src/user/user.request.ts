import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { UserLanguageEnum } from "./user.response.js";

// Update User
export const UpdateUserSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required" }).optional(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { error: "Password must contain at least 1 lowercase letter" })
    .regex(/[A-Z]/, { error: "Password must contain at least 1 uppercase letter" })
    .regex(/[0-9]/, { error: "Password must contain at least 1 digit" })
    .regex(/[^a-zA-Z0-9]/, { error: "Password must contain at least 1 special character" })
    .optional(),
  timezone: z.string().trim().min(1, { error: "Timezone is required" }).optional(),
  language: UserLanguageEnum.optional(),
  profileImageURL: z.url({ message: "Invalid image URL" }).optional().nullable()
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
