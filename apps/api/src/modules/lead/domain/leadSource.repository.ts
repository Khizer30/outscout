import { LeadSourceAutocompleteParams, LeadSourceAutocompleteResult, LeadSourceResult, LeadSourceSearchParams } from "@modules/lead/domain/leadSource.types";

export abstract class LeadSourceRepository {
  abstract autocomplete(params: LeadSourceAutocompleteParams): Promise<LeadSourceAutocompleteResult[]>;
  abstract searchNearby(params: LeadSourceSearchParams): Promise<LeadSourceResult[]>;
}
