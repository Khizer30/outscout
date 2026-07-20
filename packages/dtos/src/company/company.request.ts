import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Create Company
export const CreateCompanySchema = z.object({
  name: z.string().trim().min(1, "Company name is required").max(100, "Company name is too long"),
  about: z.string().trim().max(1000, "About section is too long").optional()
});

export class CreateCompanyDto extends createZodDto(CreateCompanySchema) {}

// Update Company
export const UpdateCompanySchema = z.object({
  name: z.string().trim().min(1, "Company name is required").max(100, "Company name is too long").optional(),
  about: z.string().trim().max(1000, "About section is too long").optional().nullable()
});

export class UpdateCompanyDto extends createZodDto(UpdateCompanySchema) {}

// Update Company Email Settings
export const UpdateCompanyEmailSettingsSchema = z.object({
  brevoApiKey: z.string().trim().min(1, "Brevo API key is required").optional(),
  fromEmail: z.email("Invalid email address").trim().optional().nullable(),
  emailSignature: z.string().trim().max(2000, "Email signature is too long").optional().nullable(),
  primaryColor: z.string().trim().max(20, "Primary color is too long").optional().nullable(),
  secondaryColor: z.string().trim().max(20, "Secondary color is too long").optional().nullable()
});

export class UpdateCompanyEmailSettingsDto extends createZodDto(UpdateCompanyEmailSettingsSchema) {}
