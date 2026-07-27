import { ChatGoogle } from "@langchain/google";
import { AiRepository } from "@modules/ai/domain/ai.repository";
import { ContactInfo } from "@modules/ai/domain/ai.types";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ContactInfoSchema } from "@repo/dtos/ai";
import { AgentMiddleware, createAgent, modelCallLimitMiddleware, modelRetryMiddleware, piiMiddleware } from "langchain";

@Injectable()
export class AiGoogleRepository extends AiRepository {
  private readonly logger = new Logger(AiGoogleRepository.name);
  private readonly model: ChatGoogle;
  private readonly middleware: AgentMiddleware[] = [
    modelCallLimitMiddleware({ runLimit: 3, exitBehavior: "error" }),
    modelRetryMiddleware({ maxRetries: 2, onFailure: "error" }),
    piiMiddleware("credit_card", { strategy: "redact", applyToInput: true })
  ];

  constructor(config: ConfigService) {
    super();
    this.model = new ChatGoogle({
      apiKey: config.getOrThrow<string>("GEMINI_API_KEY"),
      model: config.get<string>("GEMINI_MODEL") ?? "gemini-flash-latest"
    });
  }

  async extractContactInfo(content: string): Promise<ContactInfo> {
    const systemInstructions =
      "You are a business and contact information extractor. Extract a concise description of the business, emails, phone numbers, location/address, and social media profile links from website content. Return only what is explicitly present — never fabricate data.";

    const userMessage = `
      Extract business description, contact and social media information from the following website content (markdown with links in [label](url) format, followed by a deduplicated list of all page hrefs — including icon-only links not visible in the markdown).

      WEBSITE CONTENT:
      ${content.slice(0, 20000)}

      Extract and return only what is explicitly present. Do not invent or guess. Provide a concise description of what the business does based on the website content.
    `;

    try {
      const agent = createAgent({
        model: this.model,
        middleware: this.middleware,
        systemPrompt: systemInstructions,
        responseFormat: ContactInfoSchema
      });

      const result = await agent.invoke({ messages: [{ role: "user", content: userMessage }] });

      return result.structuredResponse;
    } catch (error) {
      this.logger.error(`Gemini contact extraction failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error("Failed to extract contact info via Gemini", { cause: error });
    }
  }
}
