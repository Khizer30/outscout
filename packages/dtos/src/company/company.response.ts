import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Create Company
export const CreateCompanyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  about: z.string().nullable(),
  companyImageURL: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
});

export class CreateCompanyResponseDto extends createZodDto(CreateCompanyResponseSchema) {}
