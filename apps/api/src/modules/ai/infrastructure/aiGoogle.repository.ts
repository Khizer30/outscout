import { ChatGoogle } from "@langchain/google";
import { AiRepository } from "@modules/ai/domain/ai.repository";
import {
  ContactInfo,
  ContactInfoSchema,
  EmailMessageSchema,
  GenerateOutreachMessageInput,
  GeneratedEmailMessage,
  GeneratedMessage,
  GeneratedWhatsAppMessage,
  MessagePart,
  RewriteOutreachMessageInput,
  WhatsAppMessageSchema
} from "@modules/ai/domain/ai.types";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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

  async extractBusinessInfo(content: string): Promise<ContactInfo> {
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

  async generateOutreachMessage(input: GenerateOutreachMessageInput): Promise<GeneratedMessage> {
    const about = input.company.about ?? "We help local businesses build a strong online presence, reach more customers, and grow their revenue.";

    const socialLinks = Object.entries({
      Instagram: input.lead.socialLinks.instagram,
      Facebook: input.lead.socialLinks.facebook,
      Twitter: input.lead.socialLinks.twitter,
      LinkedIn: input.lead.socialLinks.linkedin,
      TikTok: input.lead.socialLinks.tiktok,
      YouTube: input.lead.socialLinks.youtube,
      WhatsApp: input.lead.socialLinks.whatsapp
    })
      .filter(([, url]) => !!url)
      .map(([label, url]) => `${label}: ${url}`)
      .concat(input.lead.socialLinks.otherLinks)
      .join(", ");

    const userMessage = `
      Generate the outreach message for this business:

      - Name: ${input.lead.name ?? "Unknown"}
      - Description: ${input.lead.description ?? "Unknown"}
      - Type: ${input.lead.primaryType ?? "Unknown"}
      - Address: ${input.lead.address ?? "Unknown"}
      - Phone: ${input.lead.phone ?? "Unknown"}
      - Email: ${input.lead.emails[0] ?? "Not available"}
      - Website: ${input.lead.website ?? "No website"}
      - Business status: ${input.lead.businessStatus ?? "Unknown"}
      - Rating: ${input.lead.rating ?? "Unknown"} (${input.lead.userRatingCount ?? 0} reviews)
      - Social media: ${socialLinks || "None"}
    `;

    if (input.channel === "EMAIL") {
      return this.generateEmailMessage(input, about, userMessage);
    }

    return this.generateWhatsAppMessage(input, about, userMessage);
  }

  private async generateWhatsAppMessage(input: GenerateOutreachMessageInput, about: string, userMessage: string): Promise<GeneratedWhatsAppMessage> {
    const greeting = input.messageRules.greeting ?? "Hello";
    const rules =
      input.messageRules.rules ??
      `
      - Start with the greeting: "${greeting}, <BUSINESS_NAME>"
      - Address the business by name
      - Keep it under 150 words
      - Sound human, warm, and professional; not salesy or spammy
      - Mention one specific benefit relevant to their business type
      - End with a soft call-to-action (e.g. asking if they are open to a quick chat right now)
      - Do NOT use emojis
      - Do NOT include any subject line or label, just the message body
      - Do NOT mention Google Map ratings
    `;

    const systemInstructions = `
      You are an expert cold outreach copywriter for a digital marketing agency.

      Your job is to write a short, friendly, personalised WhatsApp message to a business owner.

      RULES
      ${rules}

      ABOUT OUR BUSINESS
      ${about}
    `;

    try {
      const agent = createAgent({
        model: this.model,
        middleware: this.middleware,
        systemPrompt: systemInstructions,
        responseFormat: WhatsAppMessageSchema
      });

      const result = await agent.invoke({ messages: [{ role: "user", content: userMessage }] });

      return { channel: "WHATSAPP", ...result.structuredResponse };
    } catch (error) {
      this.logger.error(`Gemini WhatsApp message generation failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error("Failed to generate WhatsApp message via Gemini", { cause: error });
    }
  }

  private async generateEmailMessage(input: GenerateOutreachMessageInput, about: string, userMessage: string): Promise<GeneratedEmailMessage> {
    const rules =
      input.messageRules.rules ??
      `
      - Write a cold outreach EMAIL — it must have a subject line and a proper email body
      - Address the recipient as the business owner/team, not by a personal name
      - Keep the body under 200 words
      - Tone: professional, human, and warm — not salesy, not pushy, not spammy
      - Subject line: concise, curiosity-driven, relevant to their business type — no clickbait
      - Opening line: a genuine, specific observation about their business (from their website if available, otherwise from their business type/location)
      - Mention 1-2 services most relevant to their specific business type
      - If the business has no website, specifically mention that we can build one for them
      - End with a single soft call-to-action — invite a reply or a quick call, nothing aggressive
      - Do NOT use emojis
      - Do NOT mention Google Map ratings
      - Do NOT use generic filler phrases like "I hope this email finds you well" or "I came across your business"
    `;

    const systemInstructions = `
      You are an expert cold outreach copywriter for a digital marketing agency.

      Your job is to write a personalised cold outreach email to a business owner.

      RULES
      ${rules}

      ABOUT OUR BUSINESS
      ${about}
    `;

    try {
      const agent = createAgent({
        model: this.model,
        middleware: this.middleware,
        systemPrompt: systemInstructions,
        responseFormat: EmailMessageSchema
      });

      const result = await agent.invoke({ messages: [{ role: "user", content: userMessage }] });

      return { channel: "EMAIL", ...result.structuredResponse };
    } catch (error) {
      this.logger.error(`Gemini email generation failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error("Failed to generate email via Gemini", { cause: error });
    }
  }

  async rewriteOutreachMessage(input: RewriteOutreachMessageInput): Promise<GeneratedMessage> {
    if (input.data.channel === "EMAIL") {
      return this.rewriteEmailMessage(input.data, input.prompt, input.company, input.messageRules, input.messagePart);
    }

    return this.rewriteWhatsAppMessage(input.data, input.prompt, input.company, input.messageRules, input.messagePart);
  }

  private async rewriteWhatsAppMessage(
    data: GeneratedWhatsAppMessage,
    prompt: string,
    company: RewriteOutreachMessageInput["company"],
    messageRules: RewriteOutreachMessageInput["messageRules"],
    messagePart?: MessagePart
  ): Promise<GeneratedWhatsAppMessage> {
    const about = company.about ?? "We help local businesses build a strong online presence, reach more customers, and grow their revenue.";
    const rules = messageRules.rules ?? "Keep it under 150 words, human, warm, and professional; not salesy or spammy.";

    const systemInstructions = `
      You are an expert cold outreach copywriter for a digital marketing agency.

      You are rewriting an existing WhatsApp outreach message per the user's instructions.
      ${messagePart ? `Focus your rewrite on the "${messagePart}" part, but return the full message.` : "Rewrite the message as a whole, keeping the same overall structure (greetings, opening, body, callToAction)."}
      Do NOT use emojis. Keep the tone human, warm, and professional; not salesy or spammy.

      RULES
      ${rules}

      ABOUT OUR BUSINESS
      ${about}
    `;

    const userMessage = `
      CURRENT MESSAGE:
      ${JSON.stringify({ greetings: data.greetings, opening: data.opening, body: data.body, callToAction: data.callToAction }, null, 2)}

      INSTRUCTIONS:
      ${prompt}
    `;

    try {
      const agent = createAgent({
        model: this.model,
        middleware: this.middleware,
        systemPrompt: systemInstructions,
        responseFormat: WhatsAppMessageSchema
      });

      const result = await agent.invoke({ messages: [{ role: "user", content: userMessage }] });
      const rewritten = result.structuredResponse;

      if (messagePart) {
        return { ...data, [messagePart]: rewritten[messagePart as keyof typeof rewritten] };
      }

      return { channel: "WHATSAPP", ...rewritten };
    } catch (error) {
      this.logger.error(`Gemini WhatsApp message rewrite failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error("Failed to rewrite WhatsApp message via Gemini", { cause: error });
    }
  }

  private async rewriteEmailMessage(
    data: GeneratedEmailMessage,
    prompt: string,
    company: RewriteOutreachMessageInput["company"],
    messageRules: RewriteOutreachMessageInput["messageRules"],
    messagePart?: MessagePart
  ): Promise<GeneratedEmailMessage> {
    const about = company.about ?? "We help local businesses build a strong online presence, reach more customers, and grow their revenue.";
    const rules = messageRules.rules ?? "Keep the body under 200 words, professional, human, and warm; not salesy, not pushy, not spammy.";

    const systemInstructions = `
      You are an expert cold outreach copywriter for a digital marketing agency.

      You are rewriting an existing cold outreach email per the user's instructions.
      ${messagePart ? `Focus your rewrite on the "${messagePart}" part, but return the full message.` : "Rewrite the message as a whole, keeping the same overall structure (subject, opening, body, callToAction, signOff)."}
      Do NOT use emojis. Keep the tone human, warm, and professional; not salesy or spammy.

      RULES
      ${rules}

      ABOUT OUR BUSINESS
      ${about}
    `;

    const userMessage = `
      CURRENT MESSAGE:
      ${JSON.stringify({ subject: data.subject, opening: data.opening, body: data.body, callToAction: data.callToAction, signOff: data.signOff }, null, 2)}

      INSTRUCTIONS:
      ${prompt}
    `;

    try {
      const agent = createAgent({
        model: this.model,
        middleware: this.middleware,
        systemPrompt: systemInstructions,
        responseFormat: EmailMessageSchema
      });

      const result = await agent.invoke({ messages: [{ role: "user", content: userMessage }] });
      const rewritten = result.structuredResponse;

      if (messagePart) {
        return { ...data, [messagePart]: rewritten[messagePart as keyof typeof rewritten] };
      }

      return { channel: "EMAIL", ...rewritten };
    } catch (error) {
      this.logger.error(`Gemini email rewrite failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error("Failed to rewrite email via Gemini", { cause: error });
    }
  }
}
