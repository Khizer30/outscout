import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Create Company
export const CreateCompanySchema = z.object({
  name: z.string().trim().min(1, "VALIDATION_COMPANY_NAME_REQUIRED").max(100, "VALIDATION_COMPANY_NAME_TOO_LONG"),
  about: z.string().trim().max(1000, "VALIDATION_COMPANY_ABOUT_TOO_LONG").optional(),
  companyImageURL: z.url("VALIDATION_IMAGE_URL_INVALID").optional().nullable()
});

export class CreateCompanyDto extends createZodDto(CreateCompanySchema) {}

// Update Company
export const UpdateCompanySchema = z.object({
  name: z.string().trim().min(1, "VALIDATION_COMPANY_NAME_REQUIRED").max(100, "VALIDATION_COMPANY_NAME_TOO_LONG").optional(),
  about: z.string().trim().max(1000, "VALIDATION_COMPANY_ABOUT_TOO_LONG").optional().nullable(),
  companyImageURL: z.url("VALIDATION_IMAGE_URL_INVALID").optional().nullable()
});

export class UpdateCompanyDto extends createZodDto(UpdateCompanySchema) {}

// Update Company Email Settings
export const UpdateCompanyEmailSettingsSchema = z.object({
  brevoApiKey: z.string().trim().min(1, "VALIDATION_BREVO_API_KEY_REQUIRED").optional(),
  fromEmail: z.email("VALIDATION_EMAIL_INVALID").trim().optional().nullable(),
  emailSignature: z.string().trim().max(2000, "VALIDATION_EMAIL_SIGNATURE_TOO_LONG").optional().nullable(),
  primaryColor: z.string().trim().max(20, "VALIDATION_PRIMARY_COLOR_TOO_LONG").optional().nullable(),
  secondaryColor: z.string().trim().max(20, "VALIDATION_SECONDARY_COLOR_TOO_LONG").optional().nullable()
});

export class UpdateCompanyEmailSettingsDto extends createZodDto(UpdateCompanyEmailSettingsSchema) {}

// Update Company Message Rules
export const UpdateCompanyMessageRulesSchema = z.object({
  channel: z.enum(["WHATSAPP", "EMAIL"]),
  rules: z.string().trim().max(2000, "VALIDATION_RULES_TOO_LONG").optional().nullable(),
  greeting: z.string().trim().max(500, "VALIDATION_GREETING_TOO_LONG").optional().nullable()
});

export class UpdateCompanyMessageRulesDto extends createZodDto(UpdateCompanyMessageRulesSchema) {}
