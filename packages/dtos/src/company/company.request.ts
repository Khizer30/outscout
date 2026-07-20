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
