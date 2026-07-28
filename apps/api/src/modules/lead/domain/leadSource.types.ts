import { LeadType } from "@modules/lead/domain/lead.types";

export interface LeadSourceAutocompleteParams {
  query: string;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
  types?: LeadType[];
}

export interface LeadSourceAutocompleteResult {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export interface LeadSourceSearchParams {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  serviceType: LeadType;
  limit: number;
}

export interface LeadSourceResult {
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

export interface LeadSourcePlaceDetailsResult {
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
}
