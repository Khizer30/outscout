import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { UserLanguageEnum } from "./user.response.js";

// Update User
export const UpdateUserSchema = z.object({
  name: z.string().trim().min(1, { error: "VALIDATION_NAME_REQUIRED" }).optional(),
  password: z
    .string()
    .min(8, { error: "VALIDATION_PASSWORD_MIN_LENGTH" })
    .regex(/[a-z]/, { error: "VALIDATION_PASSWORD_LOWERCASE_REQUIRED" })
    .regex(/[A-Z]/, { error: "VALIDATION_PASSWORD_UPPERCASE_REQUIRED" })
    .regex(/[0-9]/, { error: "VALIDATION_PASSWORD_DIGIT_REQUIRED" })
    .regex(/[^a-zA-Z0-9]/, { error: "VALIDATION_PASSWORD_SPECIAL_CHAR_REQUIRED" })
    .optional(),
  timezone: z.string().trim().min(1, { error: "VALIDATION_TIMEZONE_REQUIRED" }).optional(),
  language: UserLanguageEnum.optional(),
  profileImageURL: z.url({ message: "VALIDATION_IMAGE_URL_INVALID" }).optional().nullable()
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
