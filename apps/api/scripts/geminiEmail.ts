import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ─── Config ───────────────────────────────────────────────────────────────────
const LANGUAGE: "english" | "arabic" = "english";
// ──────────────────────────────────────────────────────────────────────────────

// ─── Hardcoded business data ───────
const BUSINESS = {
  name: "Build Better Home Real Estate & Marketing",
  primaryType: "Real Estate Agency",
  address: "Shop No LG-3, Pakistan Heights, Bahria Expressway, Phase 8 Bahria Town, Rawalpindi, Pakistan",
  phone: "+92 332 3869529",
  email: "contact@buildbetterhome.com",
  website: "",
  rating: 4.8,
  userRatingCount: 4,
  businessStatus: "OPERATIONAL",
  openNow: true
};
// ──────────────────────────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-flash-latest";

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in .env");
  process.exit(1);
}

const RULES = `
  - Language: ${LANGUAGE === "english" ? "English" : "Arabic"}
  - Write a cold outreach EMAIL — it must have a subject line and a proper email body
  - Address the recipient as the business owner/team, not by a personal name
  - Keep the body under 200 words
  - Tone: professional, human, and warm — not salesy, not pushy, not spammy
  - Subject line: concise, curiosity-driven, relevant to their business type — no clickbait
  - Opening line: a genuine, specific observation about their business (from their website if available, otherwise from their business type/location)
  - Mention 1-2 services most relevant to their specific business type
  - If the business has no website, specifically mention that we can build one for them
  - If a website URL is provided, pull one concrete specific detail from it (product, service, tagline, design style) to personalise the opening — do not fabricate; if inaccessible, note that
  - End with a single soft call-to-action — invite a reply or a quick call, nothing aggressive
  - Sign off as: Outscout Marketing Agency
  - Do NOT use emojis
  - Do NOT mention Google Map ratings
  - Do NOT use generic filler phrases like "I hope this email finds you well" or "I came across your business"
`;

const ABOUT_OUR_BUSINESS = `
  We are Outscout Marketing Agency — a full-service digital marketing agency specialising in:
  - Social media marketing & management (Instagram, Facebook, TikTok, LinkedIn)
  - YouTube channel creation, branding, and growth strategy
  - Short-form video content and reels production
  - Paid advertising campaigns (Meta Ads, Google Ads, YouTube Ads)
  - Website design and development (for businesses that don't have a website yet)
  - App development and automation
  - SEO and local search visibility on Google
  - Content creation and brand identity design
  We help local businesses build a strong online presence, reach more customers, and grow their revenue.
`;

const SYSTEM_INSTRUCTION = `
  You are an expert cold outreach copywriter for Outscout Marketing Agency.

  Your job is to write a personalised cold outreach email to a business owner.

  RULES
  ${RULES}

  ABOUT OUR BUSINESS
  ${ABOUT_OUR_BUSINESS}
`;

function buildUserMessage(): string {
  return `
  Generate the cold outreach email for this business:

  - Name: ${BUSINESS.name}
  - Type: ${BUSINESS.primaryType}
  - Address: ${BUSINESS.address}
  - Phone: ${BUSINESS.phone}
  - Email: ${BUSINESS.email || "Not available"}
  - Website: ${BUSINESS.website || "No website"}
  - Currently open: ${BUSINESS.openNow ? "Yes" : "No"}`;
}

interface EmailResponse {
  subject: string;
  opening: string;
  body: string;
  callToAction: string;
  signOff: string;
}

interface GeminiResponse {
  candidates?: {
    content: { parts: { text: string }[] };
  }[];
}

async function generateEmail(): Promise<void> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: buildUserMessage() }]
      }
    ],
    tools: [],
    generationConfig: {
      thinkingConfig: { thinkingBudget: -1 },
      mediaResolution: "MEDIA_RESOLUTION_HIGH",
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        required: ["subject", "opening", "body", "callToAction", "signOff"],
        properties: {
          subject: { type: "STRING" },
          opening: { type: "STRING" },
          body: { type: "STRING" },
          callToAction: { type: "STRING" },
          signOff: { type: "STRING" }
        }
      }
    }
  };

  console.info(`\nGenerating cold email for "${BUSINESS.name}"...\n`);
  console.info(`Language : ${LANGUAGE}\n`);
  console.info("─".repeat(60));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY! },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`API error ${response.status}:`, error);
    process.exit(1);
  }

  const data: GeminiResponse = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!rawText) {
    console.error("No response returned from Gemini.");
    process.exit(1);
  }

  const parsed: EmailResponse = JSON.parse(rawText);

  console.info(`Subject : ${parsed.subject}\n`);
  console.info("─".repeat(60));
  console.info([parsed.opening, parsed.body, parsed.callToAction, parsed.signOff].join("\n\n"));
  console.info("─".repeat(60));
  console.info("\nFull JSON:");
  console.info(JSON.stringify(parsed, null, 2));
}

generateEmail().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
