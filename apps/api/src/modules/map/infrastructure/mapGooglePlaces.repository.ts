import { LEAD_TYPES, LeadType } from "@modules/lead/domain/lead.types";
import { MapPlaceRepository } from "@modules/map/domain/mapPlace.repository";
import { MapAutocompleteParams, MapAutocompleteResult, MapPlaceResult, MapSearchParams } from "@modules/map/domain/mapPlace.types";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface GoogleAutocompleteSuggestion {
  placePrediction?: {
    placeId: string;
    text?: { text: string };
    structuredFormat?: {
      mainText?: { text: string };
      secondaryText?: { text: string };
    };
    types?: string[];
  };
}

interface GoogleAutocompleteResponse {
  suggestions?: GoogleAutocompleteSuggestion[];
}

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  types?: string[];
  primaryType?: string;
  businessStatus?: string;
  rating?: number;
  userRatingCount?: number;
}

interface GoogleNearbySearchResponse {
  places?: GooglePlace[];
}

@Injectable()
export class MapGooglePlacesRepository extends MapPlaceRepository {
  private readonly logger = new Logger(MapGooglePlacesRepository.name);
  private readonly apiKey: string;

  constructor(config: ConfigService) {
    super();
    this.apiKey = config.getOrThrow<string>("GOOGLE_PLACES_API_KEY");
  }

  async searchNearby(params: MapSearchParams): Promise<MapPlaceResult[]> {
    const fieldMask = [
      "places.id",
      "places.displayName",
      "places.formattedAddress",
      "places.location",
      "places.nationalPhoneNumber",
      "places.internationalPhoneNumber",
      "places.websiteUri",
      "places.types",
      "places.primaryType",
      "places.businessStatus",
      "places.rating",
      "places.userRatingCount"
    ].join(",");

    const body = {
      includedTypes: [params.serviceType.toLowerCase()],
      maxResultCount: params.limit,
      locationRestriction: {
        circle: {
          center: { latitude: params.latitude, longitude: params.longitude },
          radius: params.radiusMeters
        }
      }
    };

    const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": fieldMask
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Google Places API error ${response.status}: ${error}`);
      throw new Error(`Google Places API error ${response.status}`);
    }

    const data: GoogleNearbySearchResponse = await response.json();

    return (data.places ?? []).map((place) => this.toMapPlaceResult(place));
  }

  async autocomplete(params: MapAutocompleteParams): Promise<MapAutocompleteResult[]> {
    const body: Record<string, unknown> = {
      input: params.query
    };

    if (params.latitude !== undefined && params.longitude !== undefined) {
      body.locationBias = {
        circle: {
          center: {
            latitude: params.latitude,
            longitude: params.longitude
          },
          radius: params.radiusMeters ?? 5000
        }
      };
    }

    if (params.types && params.types.length > 0) {
      body.includedPrimaryTypes = params.types.map((t) => t.toLowerCase());
    }

    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Google Places Autocomplete API error ${response.status}: ${error}`);
      throw new Error(`Google Places Autocomplete API error ${response.status}`);
    }

    const data: GoogleAutocompleteResponse = await response.json();

    return (data.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({
        placeId: p.placeId,
        text: p.text?.text ?? "",
        mainText: p.structuredFormat?.mainText?.text ?? "",
        secondaryText: p.structuredFormat?.secondaryText?.text ?? "",
        types: p.types ?? []
      }));
  }

  async getPlaceDetails(placeId: string): Promise<MapPlaceResult | null> {
    const fieldMask = [
      "id",
      "displayName",
      "formattedAddress",
      "location",
      "nationalPhoneNumber",
      "internationalPhoneNumber",
      "websiteUri",
      "types",
      "primaryType",
      "businessStatus",
      "rating",
      "userRatingCount"
    ].join(",");

    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": fieldMask
      }
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Google Place Details API error ${response.status}: ${error}`);
      throw new Error(`Google Place Details API error ${response.status}`);
    }

    const place: GooglePlace = await response.json();

    return this.toMapPlaceResult(place);
  }

  private toLeadType(googleType: string): LeadType | null {
    const candidate = googleType.toUpperCase();
    return (LEAD_TYPES as readonly string[]).includes(candidate) ? (candidate as LeadType) : null;
  }

  private toMapPlaceResult(place: GooglePlace): MapPlaceResult {
    const types = (place.types ?? []).map(this.toLeadType).filter((type): type is LeadType => type !== null);
    const primaryType = place.primaryType ? this.toLeadType(place.primaryType) : null;

    return {
      placeId: place.id,
      name: place.displayName?.text ?? null,
      address: place.formattedAddress ?? null,
      latitude: place.location?.latitude ?? null,
      longitude: place.location?.longitude ?? null,
      phone: place.internationalPhoneNumber ?? null,
      website: place.websiteUri ?? null,
      businessStatus: place.businessStatus ?? null,
      rating: place.rating ?? null,
      userRatingCount: place.userRatingCount ?? null,
      primaryType,
      types,
      otherPhones: []
    };
  }
}
