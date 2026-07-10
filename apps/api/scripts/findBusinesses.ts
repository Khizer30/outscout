import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

/*
Possible Target Services

software_company
advertising_agency
marketing_agency
restaurant
hotel
hospital
dental_clinic
real_estate_agency
law_firm
accounting
gym
beauty_salon
*/

// --- Hardcoded test values ----------------------------------------------------
const LOCATION = { lat: 33.4929479, lng: 73.0997494 };
const SERVICE_TYPE = "real_estate_agency";
const RADIUS_METERS = 2000;
const MAX_RESULTS = 10;
// -----------------------------------------------------------------------------

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error("?  GOOGLE_PLACES_API_KEY is not set in .env");
  process.exit(1);
}

interface Place {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  types?: string[];
  primaryType?: string;
  primaryTypeDisplayName?: { text: string };
  businessStatus?: string;
  rating?: number;
  userRatingCount?: number;
  regularOpeningHours?: { openNow: boolean };
}

interface NearbySearchResponse {
  places?: Place[];
}

async function searchNearby(): Promise<void> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const body = {
    includedTypes: [SERVICE_TYPE],
    maxResultCount: MAX_RESULTS,
    locationRestriction: {
      circle: {
        center: { latitude: LOCATION.lat, longitude: LOCATION.lng },
        radius: RADIUS_METERS
      }
    }
  };

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
    "places.primaryTypeDisplayName",
    "places.businessStatus",
    "places.rating",
    "places.userRatingCount",
    "places.regularOpeningHours"
  ].join(",");

  console.info(`\n??  Searching for "${SERVICE_TYPE}" near (${LOCATION.lat}, ${LOCATION.lng}) within ${RADIUS_METERS}m...\n`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": fieldMask
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`?  API error ${response.status}:`, error);
    process.exit(1);
  }

  const data: NearbySearchResponse = await response.json();
  const places = data.places ?? [];

  if (places.length === 0) {
    console.info("??  No results found.");
    return;
  }

  console.info(`?  Found ${places.length} result(s):\n`);

  places.forEach((place, i) => {
    console.info("-".repeat(60));
    console.info(`#${i + 1}  ${place.displayName?.text ?? "Unknown"}`);
    console.info("-".repeat(60));
    console.info(`  ID            : ${place.id}`);
    console.info(`  Primary Type  : ${place.primaryTypeDisplayName?.text ?? place.primaryType ?? "N/A"}`);
    console.info(`  All Types     : ${place.types?.join(", ") ?? "N/A"}`);
    console.info(`  Status        : ${place.businessStatus ?? "N/A"}`);
    console.info(`  Address       : ${place.formattedAddress ?? "N/A"}`);
    console.info(`  Location      : ${place.location ? `${place.location.latitude}, ${place.location.longitude}` : "N/A"}`);
    console.info(`  Phone (local) : ${place.nationalPhoneNumber ?? "N/A"}`);
    console.info(`  Phone (intl)  : ${place.internationalPhoneNumber ?? "N/A"}`);
    console.info(`  Website       : ${place.websiteUri ?? "N/A"}`);
    console.info(`  Rating        : ${place.rating !== null ? `${place.rating} ? (${place.userRatingCount} reviews)` : "N/A"}`);
    console.info(`  Open Now      : ${place.regularOpeningHours !== null ? (place?.regularOpeningHours?.openNow ? "Yes" : "No") : "N/A"}`);
  });

  console.info("-".repeat(60) + "\n");
}

searchNearby().catch((err) => {
  console.error("?  Unexpected error:", err);
  process.exit(1);
});
