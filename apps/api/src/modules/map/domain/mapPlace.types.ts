import { LeadType } from "@modules/lead/domain/lead.types";

export interface MapAutocompleteParams {
  query: string;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
  types?: LeadType[];
}

export interface MapAutocompleteResult {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export interface MapSearchParams {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  serviceType: LeadType;
  limit: number;
}

export interface MapPlaceResult {
  placeId: string;
  name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website: string | null;
  businessStatus: string | null;
  rating: number | null;
  userRatingCount: number | null;
  primaryType: LeadType | null;
  types: LeadType[];
  otherPhones: string[];
}
