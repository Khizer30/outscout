import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Generate Signed URL
export const GenerateSignedUrlSchema = z.object({
  folder: z.string().trim().min(1, { message: "Folder must not be empty" }).optional(),
  width: z.coerce.number().positive({ message: "Width must be positive" }).optional(),
  height: z.coerce.number().positive({ message: "Height must be positive" }).optional()
});

export class GenerateSignedUrlDto extends createZodDto(GenerateSignedUrlSchema) {}

// Delete Image
export const DeleteImageSchema = z.object({
  url: z.string().trim().min(1, { message: "Image URL is required" })
});

export class DeleteImageDto extends createZodDto(DeleteImageSchema) {}
