import {
  LeadSourceAutocompleteParams,
  LeadSourceAutocompleteResult,
  LeadSourcePlaceDetailsResult,
  LeadSourceResult,
  LeadSourceSearchParams
} from "@modules/lead/domain/leadSource.types";

export abstract class LeadSourceRepository {
  abstract autocomplete(params: LeadSourceAutocompleteParams): Promise<LeadSourceAutocompleteResult[]>;
  abstract getPlaceDetails(placeId: string): Promise<LeadSourcePlaceDetailsResult | null>;
  abstract searchNearby(params: LeadSourceSearchParams): Promise<LeadSourceResult[]>;
}
