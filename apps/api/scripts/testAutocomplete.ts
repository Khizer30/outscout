import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// --- Hardcoded test value ---
const QUERY = "Saddar";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error("GOOGLE_PLACES_API_KEY is not set in .env");
  process.exit(1);
}

interface AutocompleteSuggestion {
  placePrediction?: {
    placeId: string;
    text: { text: string };
    structuredFormat: {
      mainText: { text: string };
      secondaryText: { text: string };
    };
    types: string[];
  };
}

interface AutocompleteResponse {
  suggestions?: AutocompleteSuggestion[];
}

async function autocomplete(): Promise<void> {
  const url = "https://places.googleapis.com/v1/places:autocomplete";
  const body = { input: QUERY };

  console.info(`\nAutocompleting: "${QUERY}"\n`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY!
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`API error ${response.status}:`, error);
    process.exit(1);
  }

  const data: AutocompleteResponse = await response.json();
  const suggestions = (data.suggestions ?? []).filter((s) => s.placePrediction);

  if (suggestions.length === 0) {
    console.info("No suggestions found.");
    return;
  }

  console.info(`Found ${suggestions.length} suggestion(s):\n`);

  suggestions.forEach((s, i) => {
    const p = s.placePrediction!;
    console.info(`${i + 1}. ${p.text.text}`);
    console.info(`   ID  : ${p.placeId}`);
    console.info(`   Main      : ${p.structuredFormat.mainText.text}`);
    console.info(`   Secondary : ${p.structuredFormat.secondaryText.text}`);
    console.info(`   Types     : ${p.types.join(", ")}`);
    console.info();
  });
}

autocomplete().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
