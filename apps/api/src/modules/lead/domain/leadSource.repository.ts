import { LeadSourceResult, LeadSourceSearchParams } from "@modules/lead/domain/leadSource.types";

export abstract class LeadSourceRepository {
  abstract searchNearby(params: LeadSourceSearchParams): Promise<LeadSourceResult[]>;
}
