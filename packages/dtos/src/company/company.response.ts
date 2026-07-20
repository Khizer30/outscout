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

// Company Membership
export const CompanyMembershipResponseSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  userId: z.string(),
  role: z.enum(["COMPANY_ADMIN", "COMPANY_USER"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  joinedAt: z.date()
});

export class CompanyMembershipResponseDto extends createZodDto(CompanyMembershipResponseSchema) {}

// Create Company
export const CreateCompanyResponseSchema = z.object({
  data: CompanyResponseSchema
});

export class CreateCompanyResponseDto extends createZodDto(CreateCompanyResponseSchema) {}

// Get User Companies
export const GetUserCompaniesResponseSchema = z.object({
  data: z.array(
    z.object({
      company: CompanyResponseSchema,
      membership: CompanyMembershipResponseSchema
    })
  )
});

export class GetUserCompaniesResponseDto extends createZodDto(GetUserCompaniesResponseSchema) {}

// Update Company
export const UpdateCompanyResponseSchema = z.object({
  data: CompanyResponseSchema
});

export class UpdateCompanyResponseDto extends createZodDto(UpdateCompanyResponseSchema) {}

// Company Email Settings
export const CompanyEmailSettingsResponseSchema = z.object({
  companyId: z.string(),
  fromEmail: z.string().nullable(),
  emailSignature: z.string().nullable(),
  primaryColor: z.string().nullable(),
  secondaryColor: z.string().nullable(),
  hasBrevoApiKey: z.boolean(),
  updatedAt: z.date()
});

export class CompanyEmailSettingsResponseDto extends createZodDto(CompanyEmailSettingsResponseSchema) {}

// Update Company Email Settings
export const UpdateCompanyEmailSettingsResponseSchema = z.object({
  data: CompanyEmailSettingsResponseSchema
});

export class UpdateCompanyEmailSettingsResponseDto extends createZodDto(UpdateCompanyEmailSettingsResponseSchema) {}
