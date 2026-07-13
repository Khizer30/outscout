import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ─── Config ───────────────────────────────────────────────────────────────────
const GREETING: "assalam" | "hello" | "hi" | "greetings" = "assalam";
const LANGUAGE: "english" | "arabic" = "english";
// ──────────────────────────────────────────────────────────────────────────────

// ─── Hardcoded business data ───────
const BUSINESS = {
  name: "Build Better Home Real Estate & Marketing",
  primaryType: "Real Estate Agency",
  address: "Shop No LG-3, Pakistan Heights, Bahria Expressway, Phase 8 Bahria Town, Rawalpindi, Pakistan",
  phone: "+92 332 3869529",
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

const GREETING_MAP = {
  assalam: "Assalam Wallikum",
  hello: "Hello",
  hi: "Hi",
  greetings: "Greetings"
};

const RULES = `
  - Language: ${LANGUAGE === "english" ? "English" : "Arabic"}
  - Start with the greeting: "${GREETING_MAP[GREETING]}, <BUSINESS_NAME>"
  - Address the business by name
  - Keep it under 150 words
  - Sound human, warm, and professional; not salesy or spammy
  - Mention one specific benefit relevant to their business type
  - End with a soft call-to-action (e.g. asking if they are open to a quick chat right now)
  - Do NOT use emojis
  - Do NOT include any subject line or label, just the message body
  - If the business has no website, specifically mention that we can build one for them
  - Mention 1-2 services most relevant to their specific business type (e.g. YouTube for content creators, social media for restaurants, website for businesses without one)
  - If a website URL is provided, search the website first and pull one concrete, specific detail from it
      (e.g. a product, service, recent post, tagline, design style, or something notable about their offering) to use as a natural piece of small talk in the message — this should feel observant, not generic.
      Do not fabricate details if the site can't be accessed. If website inaccessible, mention that your website is inaccessible.
  - Do NOT mention Google Map ratings
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

  Your job is to write a short, friendly, personalised WhatsApp message to a business owner.

  RULES
  ${RULES}

  ABOUT OUR BUSINESS
  ${ABOUT_OUR_BUSINESS}
`;

function buildUserMessage(): string {
  return `
  Generate the WhatsApp outreach message for this business:

  - Name: ${BUSINESS.name}
  - Type: ${BUSINESS.primaryType}
  - Address: ${BUSINESS.address}
  - Phone: ${BUSINESS.phone}
  - Website: ${BUSINESS.website || "No website"}
  - Currently open: ${BUSINESS.openNow ? "Yes" : "No"}`;
}

interface MessageResponse {
  greetings: string;
  smallTalk: string;
  mainText: string;
  callToAction: string;
}

interface GeminiResponse {
  candidates?: {
    content: { parts: { text: string }[] };
  }[];
}

async function generateWhatsAppMessage(): Promise<void> {
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
        required: ["greetings", "smallTalk", "mainText", "callToAction"],
        properties: {
          greetings: { type: "STRING" },
          smallTalk: { type: "STRING" },
          mainText: { type: "STRING" },
          callToAction: { type: "STRING" }
        }
      }
    }
  };

  console.info(`\nGenerating WhatsApp message for "${BUSINESS.name}"...\n`);
  console.info(`Greeting : ${GREETING_MAP[GREETING]}`);
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
    console.error("No message returned from Gemini.");
    process.exit(1);
  }

  const parsed: MessageResponse = JSON.parse(rawText);
  const fullMessage = [parsed.greetings, parsed.smallTalk, parsed.mainText, parsed.callToAction].join("\n\n");

  console.info(fullMessage);
  console.info("─".repeat(60));
}

generateWhatsAppMessage().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
