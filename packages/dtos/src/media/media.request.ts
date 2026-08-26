import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Generate Signed URL
export const GenerateSignedUrlSchema = z.object({
  folder: z.string().trim().min(1, { message: "VALIDATION_FOLDER_REQUIRED" }).optional(),
  width: z.coerce.number().positive({ message: "VALIDATION_WIDTH_POSITIVE" }).optional(),
  height: z.coerce.number().positive({ message: "VALIDATION_HEIGHT_POSITIVE" }).optional()
});

export class GenerateSignedUrlDto extends createZodDto(GenerateSignedUrlSchema) {}

// Delete Image
export const DeleteImageSchema = z.object({
  url: z.string().trim().min(1, { message: "VALIDATION_IMAGE_URL_REQUIRED" })
});

export class DeleteImageDto extends createZodDto(DeleteImageSchema) {}
