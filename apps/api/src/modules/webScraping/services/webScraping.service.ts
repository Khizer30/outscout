import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { chromium } from "playwright";
import TurndownService from "turndown";

@Injectable()
export class WebScrapingService {
  private readonly timeoutMs = 15000;
  private readonly turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService();
    this.turndownService.remove(["script", "style", "noscript", "svg", "head", "button", "input", "select", "textarea"] as (keyof HTMLElementTagNameMap)[]);
    this.turndownService.addRule("mailto", {
      filter: (node) => node.nodeName === "A" && !!node.getAttribute("href")?.startsWith("mailto:"),
      replacement: (content, node) => {
        const href = (node as HTMLAnchorElement).getAttribute("href") ?? "";
        const email = href.replace("mailto:", "").split("?")[0];
        return content ? `[${content}](${email})` : email;
      }
    });
  }

  async scrape(websiteUrl: string): Promise<string> {
    let url = websiteUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const browser = await chromium.launch({ headless: true });

    try {
      const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        locale: "en-US"
      });

      const page = await context.newPage();

      await page.route("**/*", (route) => {
        const type = route.request().resourceType();
        if (["image", "media", "font", "stylesheet"].includes(type)) {
          route.abort();
        } else {
          route.continue();
        }
      });

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: this.timeoutMs });
      await page.waitForTimeout(2000);

      const bodyHtml = await page.evaluate(() => document.body.innerHTML);
      const markdown = this.turndownService
        .turndown(bodyHtml)
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll("a[href]"))
          .map((a) => a.getAttribute("href") ?? "")
          .filter((h) => h && !h.startsWith("javascript:"))
          .map((h) => (h.startsWith("mailto:") ? h.replace("mailto:", "").split("?")[0] : h))
          .filter((h, i, arr) => arr.indexOf(h) === i)
      );

      return `${markdown}\n\nALL HREFS ON PAGE:\n${hrefs.join("\n")}`;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to scrape ${url}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      await browser.close();
    }
  }
}
