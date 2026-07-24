import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Upload Image Signature Data Schema
export const UploadImageSignatureSchema = z.object({
  signature: z.string(),
  timestamp: z.number(),
  apiKey: z.string(),
  cloudName: z.string(),
  eager: z.string(),
  folder: z.string()
});

// Generate Signed URL Response
export const GenerateSignedUrlResponseSchema = z.object({
  data: UploadImageSignatureSchema
});

export class GenerateSignedUrlResponseDto extends createZodDto(GenerateSignedUrlResponseSchema) {}

// Delete Image Response
export const DeleteImageResponseSchema = z.object({
  message: z.string()
});

export class DeleteImageResponseDto extends createZodDto(DeleteImageResponseSchema) {}
