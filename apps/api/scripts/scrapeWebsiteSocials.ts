import { chromium } from "playwright";

// ─── Config ───────────────────────────────────────────────────────────────────
const WEBSITE_URL = "https://www.systemsltd.com";

const TIMEOUT_MS = 15_000;

// Known social domains and the key they map to
const SOCIAL_PATTERNS: { key: string; pattern: RegExp }[] = [
  { key: "instagram", pattern: /instagram\.com\/(?!p\/|reel\/|explore\/)[^/?#"'\s]+/i },
  { key: "facebook", pattern: /facebook\.com\/(?!sharer|share|dialog)[^/?#"'\s]+/i },
  { key: "twitter", pattern: /(?:twitter|x)\.com\/(?!intent\/|share)[^/?#"'\s]+/i },
  { key: "linkedin", pattern: /linkedin\.com\/(?:company|in)\/[^/?#"'\s]+/i },
  { key: "tiktok", pattern: /tiktok\.com\/@[^/?#"'\s]+/i },
  { key: "youtube", pattern: /youtube\.com\/(?:@|channel\/|c\/)[^/?#"'\s]+/i }
];

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\.[a-zA-Z]{2,}/g;

// Emails to ignore (icons, placeholders, libraries, etc.)
const EMAIL_BLOCKLIST = [
  /^.*\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|ttf)$/i,
  /^example\./i,
  /@example\./i,
  /^test\./i,
  /@test\./i,
  /sentry/i,
  /wix\.com/i,
  /wordpress/i,
  /schema\.org/i,
  /w3\.org/i,
  /youremail/i,
  /email@domain/i,
  /noreply/i,
  /no-reply/i
];

export interface SocialLinks {
  email: string[];
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  other: string[];
}

function normalizeUrl(url: string): string {
  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

function extractSocials(html: string, hrefs: string[]): SocialLinks {
  const result: SocialLinks = { email: [], other: [] };
  const seen = new Set<string>();

  // Extract emails from raw HTML
  const emailMatches = html.match(EMAIL_PATTERN) ?? [];
  for (const email of emailMatches) {
    const lower = email.toLowerCase();
    if (seen.has(lower)) {
      continue;
    }

    if (EMAIL_BLOCKLIST.some((rx) => rx.test(lower))) {
      continue;
    }
    seen.add(lower);

    result.email.push(email);
  }

  // Extract social links from all hrefs
  const allText = hrefs.join("\n");
  for (const { key, pattern } of SOCIAL_PATTERNS) {
    const match = allText.match(pattern);
    if (match) {
      const full = hrefs.find((h) => pattern.test(h));
      if (full) {
        (result as unknown as Record<string, unknown>)[key] = full.split("?")[0].replace(/\/$/, "");
      }
    }
  }

  // Collect unmatched social-looking links as "other"
  const knownDomains = ["instagram", "facebook", "twitter", "x.com", "linkedin", "tiktok", "youtube", "pinterest", "snapchat", "wa.me", "whatsapp"];
  for (const href of hrefs) {
    if (!href.startsWith("http")) {
      continue;
    }

    const isKnown = knownDomains.some((d) => href.includes(d));
    if (isKnown) {
      continue;
    }

    // Check for other social-looking domains not in our list
    const otherSocialDomains = [
      "threads.net",
      "t.me",
      "telegram.me",
      "discord.gg",
      "discord.com/invite",
      "github.com",
      "behance.net",
      "dribbble.com",
      "medium.com"
    ];
    if (otherSocialDomains.some((d) => href.includes(d)) && !seen.has(href)) {
      seen.add(href);
      result.other.push(href.split("?")[0]);
    }
  }

  return result;
}

async function scrapeWebsiteSocials(websiteUrl: string): Promise<SocialLinks> {
  const url = normalizeUrl(websiteUrl);
  console.info(`\nScraping: ${url}\n`);

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      locale: "en-US",
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    });

    const page = await context.newPage();

    // Block heavy resources we don't need
    await page.route("**/*", (route) => {
      const resourceType = route.request().resourceType();
      if (["image", "media", "font", "stylesheet"].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: TIMEOUT_MS });

    // Wait a bit for JS-rendered content
    await page.waitForTimeout(2000);

    const html = await page.content();

    // Collect all hrefs
    const hrefs = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll("a[href]"));
      return anchors
        .map((a) => (a as HTMLAnchorElement).href)
        .filter((h) => (h && !h.startsWith("javascript:") && !h.startsWith("mailto:") === false) || h.startsWith("mailto:") || h.startsWith("http"));
    });

    // Also grab mailto: hrefs separately for emails
    const mailtoHrefs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a[href^='mailto:']")).map((a) =>
        (a as HTMLAnchorElement).getAttribute("href")!.replace("mailto:", "").split("?")[0].trim()
      );
    });

    const socials = extractSocials(html, hrefs as string[]);

    // Merge mailto emails, deduplicate
    for (const email of mailtoHrefs) {
      if (email && !socials.email.includes(email)) {
        socials.email.push(email);
      }
    }

    return socials;
  } finally {
    await browser.close();
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
if (!WEBSITE_URL) {
  console.error("Kindly, set WEBSITE_URL");
  process.exit(1);
}

scrapeWebsiteSocials(WEBSITE_URL)
  .then((result) => {
    console.info("RESULTS");
    console.info(JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
