import type { LeadSocialLinksSchema, LeadStatusSchema } from "@repo/dtos/lead";
import { Ban, CircleCheck, Clock, Heart, Loader2, Send } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaWhatsapp, FaXTwitter, FaYoutube } from "react-icons/fa6";
import type { z } from "zod";

type LeadStatus = z.infer<typeof LeadStatusSchema>;
type LeadSocialLinks = z.infer<typeof LeadSocialLinksSchema>;

export const STATUS_ICONS: Record<LeadStatus, typeof Loader2> = {
  ENRICHING: Loader2,
  READY: CircleCheck,
  CONTACTED: Send,
  INTERESTED: Heart,
  UNRESPONSIVE: Clock,
  REJECTED: Ban
};

export const STATUS_CHIP_CLASSES: Record<LeadStatus, string> = {
  ENRICHING: "bg-muted text-muted-foreground",
  READY: "bg-sky-500/15 text-sky-500",
  CONTACTED: "bg-primary/15 text-primary",
  INTERESTED: "bg-amber-500/15 text-amber-500",
  UNRESPONSIVE: "bg-muted text-muted-foreground",
  REJECTED: "bg-destructive/15 text-destructive"
};

export const SOCIAL_PLATFORMS = [
  { key: "facebook", Icon: FaFacebook },
  { key: "instagram", Icon: FaInstagram },
  { key: "twitter", Icon: FaXTwitter },
  { key: "linkedin", Icon: FaLinkedin },
  { key: "tiktok", Icon: FaTiktok },
  { key: "youtube", Icon: FaYoutube },
  { key: "whatsapp", Icon: FaWhatsapp }
] as const satisfies { key: Exclude<keyof LeadSocialLinks, "otherLinks">; Icon: unknown }[];

export function formatWhatsAppLink(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|chat\.whatsapp\.com)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  let cleaned = trimmed.replace(/\D/g, "");
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  }

  return cleaned ? `https://wa.me/${cleaned}` : "";
}

export function formatSocialLink(key: string, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (key === "whatsapp") {
    return formatWhatsAppLink(trimmed);
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
