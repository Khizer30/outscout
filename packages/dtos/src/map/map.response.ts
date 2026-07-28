import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { LeadTypeSchema } from "../lead/lead.request.js";

// Autocomplete
export const AutocompletePredictionSchema = z.object({
  placeId: z.string(),
  text: z.string(),
  mainText: z.string(),
  secondaryText: z.string(),
  types: z.array(z.string())
});

export const AutocompleteResponseSchema = z.object({
  data: z.array(AutocompletePredictionSchema)
});

export class AutocompleteResponseDto extends createZodDto(AutocompleteResponseSchema) {}

// Place Details
export const PlaceDetailsSchema = z.object({
  placeId: z.string(),
  name: z.string().nullable(),
  address: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  businessStatus: z.string().nullable(),
  rating: z.number().nullable(),
  userRatingCount: z.number().nullable(),
  primaryType: LeadTypeSchema.nullable(),
  types: z.array(LeadTypeSchema),
  otherPhones: z.array(z.string())
});

export const GetPlaceDetailsResponseSchema = z.object({
  data: PlaceDetailsSchema
});

export class GetPlaceDetailsResponseDto extends createZodDto(GetPlaceDetailsResponseSchema) {}
