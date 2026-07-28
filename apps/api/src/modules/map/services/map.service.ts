import { MapPlaceRepository } from "@modules/map/domain/mapPlace.repository";
import { MapAutocompleteParams, MapAutocompleteResult, MapPlaceResult, MapSearchParams } from "@modules/map/domain/mapPlace.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MapService {
  constructor(private readonly mapPlaceRepo: MapPlaceRepository) {}

  async autocomplete(params: MapAutocompleteParams): Promise<MapAutocompleteResult[]> {
    return this.mapPlaceRepo.autocomplete(params);
  }

  async getPlaceDetails(placeId: string): Promise<MapPlaceResult | null> {
    return this.mapPlaceRepo.getPlaceDetails(placeId);
  }

  async searchNearby(params: MapSearchParams): Promise<MapPlaceResult[]> {
    return this.mapPlaceRepo.searchNearby(params);
  }
}
