import * as path from "path";
import * as dotenv from "dotenv";
import { chromium } from "playwright";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ─── Config ───────────────────────────────────────────────────────────────────
const WEBSITE_URL = "https://www.systemsltd.com";
const TIMEOUT_MS = 15_000;
const GEMINI_MODEL = "gemini-flash-latest";
// ──────────────────────────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in .env");
  process.exit(1);
}

export interface ContactInfo {
  emails: string[];
  phones: string[];
  location: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  tiktok: string | null;
  youtube: string | null;
  whatsapp: string | null;
  other: string[];
}

interface GeminiResponse {
  candidates?: { content: { parts: { text: string }[] } }[];
}

async function extractWithGemini(markdown: string, hrefs: string[]): Promise<ContactInfo> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const userMessage = `Extract contact and social media information from the following website content.

  MARKDOWN CONTENT (links are in [label](url) format):
  ${markdown.slice(0, 20000)}

  ALL HREFS ON PAGE (deduplicated — includes icon-only links not visible in markdown):
  ${hrefs.join("\n")}

  Extract and return only what is explicitly present. Do not invent or guess.`;

  const body = {
    system_instruction: {
      parts: [
        {
          text: "You are a contact information extractor. Extract emails, phone numbers, location/address, and social media profile links from website content. Return only what is explicitly present — never fabricate data."
        }
      ]
    },
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    tools: [],
    generationConfig: {
      thinkingConfig: { thinkingBudget: -1 },
      mediaResolution: "MEDIA_RESOLUTION_HIGH",
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        required: ["emails", "phones", "location", "instagram", "facebook", "twitter", "linkedin", "tiktok", "youtube", "whatsapp", "other"],
        properties: {
          emails: { type: "ARRAY", items: { type: "STRING" } },
          phones: { type: "ARRAY", items: { type: "STRING" } },
          location: { type: "STRING", nullable: true },
          instagram: { type: "STRING", nullable: true },
          facebook: { type: "STRING", nullable: true },
          twitter: { type: "STRING", nullable: true },
          linkedin: { type: "STRING", nullable: true },
          tiktok: { type: "STRING", nullable: true },
          youtube: { type: "STRING", nullable: true },
          whatsapp: { type: "STRING", nullable: true },
          other: { type: "ARRAY", items: { type: "STRING" } }
        }
      }
    }
  };

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

  return JSON.parse(rawText) as ContactInfo;
}

async function scrapeContactsAI(websiteUrl: string): Promise<ContactInfo> {
  let url = websiteUrl.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  console.info(`\nScraping: ${url}\n`);

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      locale: "en-US"
    });

    const page = await context.newPage();

    // Block heavy resources
    await page.route("**/*", (route) => {
      const type = route.request().resourceType();
      if (["image", "media", "font", "stylesheet"].includes(type)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: TIMEOUT_MS });
    await page.waitForTimeout(2000);

    // Convert body to lightweight markdown preserving href/mailto values
    const markdown = (await page.evaluate(`
      (function () {
        function nodeToMd(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent ? node.textContent.replace(/\\s+/g, " ") : "";
          }
          if (node.nodeType !== Node.ELEMENT_NODE) return "";
          var el = node;
          var tag = el.tagName.toLowerCase();
          if (["script","style","noscript","svg","head","img","button","input","select","textarea"].includes(tag)) return "";
          var children = Array.from(el.childNodes).map(nodeToMd).join("").trim();
          if (tag === "a") {
            var href = el.href || el.getAttribute("href") || "";
            if (!href || href.startsWith("javascript:")) return children;
            var url = href.startsWith("mailto:") ? href.replace("mailto:", "").split("?")[0] : href;
            return children ? "[" + children + "](" + url + ")" : url;
          }
          if (["h1","h2","h3","h4"].includes(tag)) return "\\n## " + children + "\\n";
          if (["p","div","section","article","li"].includes(tag)) return "\\n" + children;
          if (tag === "br") return "\\n";
          return children;
        }
        return nodeToMd(document.body).replace(/\\n{3,}/g, "\\n\\n").trim();
      })()
    `)) as string;

    // Collect all hrefs separately — safety net for icon-only links with no text
    const hrefs: string[] = (await page.evaluate(`
      Array.from(document.querySelectorAll("a[href]"))
        .map(function(a) { return a.href || a.getAttribute("href") || ""; })
        .filter(function(h) { return h && !h.startsWith("javascript:"); })
        .map(function(h) { return h.startsWith("mailto:") ? h.replace("mailto:", "").split("?")[0] : h; })
        .filter(function(h, i, arr) { return arr.indexOf(h) === i; })
    `)) as string[];

    console.info(`Markdown length: ${markdown.length} chars, Links found: ${hrefs.length}\n`);
    console.info("Sending to Gemini for extraction...\n");
    return await extractWithGemini(markdown, hrefs);
  } finally {
    await browser.close();
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
if (!WEBSITE_URL) {
  console.error("Set WEBSITE_URL in the config section");
  process.exit(1);
}

scrapeContactsAI(WEBSITE_URL)
  .then((result) => {
    console.info("─".repeat(60));
    console.info("EXTRACTED CONTACTS");
    console.info("─".repeat(60));
    console.info(JSON.stringify(result, null, 2));
    console.info("─".repeat(60));
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
