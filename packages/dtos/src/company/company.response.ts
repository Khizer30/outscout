import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Company
export const CompanyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  about: z.string().nullable(),
  companyImageURL: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
});

export class CompanyResponseDto extends createZodDto(CompanyResponseSchema) {}

// Create Company
export const CreateCompanyResponseSchema = z.object({
  data: CompanyResponseSchema
});

export class CreateCompanyResponseDto extends createZodDto(CreateCompanyResponseSchema) {}
