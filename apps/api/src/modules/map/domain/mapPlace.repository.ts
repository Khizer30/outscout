import { MapAutocompleteParams, MapAutocompleteResult, MapPlaceResult, MapSearchParams } from "@modules/map/domain/mapPlace.types";

export abstract class MapPlaceRepository {
  abstract autocomplete(params: MapAutocompleteParams): Promise<MapAutocompleteResult[]>;
  abstract getPlaceDetails(placeId: string): Promise<MapPlaceResult | null>;
  abstract searchNearby(params: MapSearchParams): Promise<MapPlaceResult[]>;
}
