import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const IdSchema = z.object({
  id: z.string().min(1, "VALIDATION_ID_REQUIRED")
});

export class IdDto extends createZodDto(IdSchema) {}
