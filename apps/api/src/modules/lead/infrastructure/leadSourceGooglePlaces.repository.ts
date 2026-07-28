import { LEAD_TYPES, LeadType } from "@modules/lead/domain/lead.types";
import { LeadSourceRepository } from "@modules/lead/domain/leadSource.repository";
import { LeadSourceAutocompleteParams, LeadSourceAutocompleteResult, LeadSourceResult, LeadSourceSearchParams } from "@modules/lead/domain/leadSource.types";
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

const FIELD_MASK = [
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

function toLeadType(googleType: string): LeadType | null {
  const candidate = googleType.toUpperCase();
  return (LEAD_TYPES as readonly string[]).includes(candidate) ? (candidate as LeadType) : null;
}

@Injectable()
export class LeadSourceGooglePlacesRepository extends LeadSourceRepository {
  private readonly logger = new Logger(LeadSourceGooglePlacesRepository.name);
  private readonly apiKey: string;

  constructor(config: ConfigService) {
    super();
    this.apiKey = config.getOrThrow<string>("GOOGLE_PLACES_API_KEY");
  }

  async searchNearby(params: LeadSourceSearchParams): Promise<LeadSourceResult[]> {
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
        "X-Goog-FieldMask": FIELD_MASK
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Google Places API error ${response.status}: ${error}`);
      throw new Error(`Google Places API error ${response.status}`);
    }

    const data: GoogleNearbySearchResponse = await response.json();

    return (data.places ?? []).map((place) => this.toLeadSourceResult(place));
  }

  async autocomplete(params: LeadSourceAutocompleteParams): Promise<LeadSourceAutocompleteResult[]> {
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

  private toLeadSourceResult(place: GooglePlace): LeadSourceResult {
    const types = (place.types ?? []).map(toLeadType).filter((type): type is LeadType => type !== null);
    const primaryType = place.primaryType ? toLeadType(place.primaryType) : null;

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
