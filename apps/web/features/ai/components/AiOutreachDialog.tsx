"use client";
import { useOutreachMessagesByLead, useRewriteOutreachMessage } from "@features/ai/api/ai.api";
import { useGenerateOutreachMessage, useGenerateWhatsAppLink, useSendOutreachEmail } from "@features/lead/api/lead.api";
import type { MessageChannelSchema } from "@repo/dtos/lead";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@shared/components/ui/dialog";
import { Textarea } from "@shared/components/ui/textarea";
import { getErrorMessage } from "@shared/lib/error";
import { ChevronLeft, ChevronRight, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

type Channel = z.infer<typeof MessageChannelSchema>;

const WHATSAPP_PARTS = ["greetings", "opening", "body", "callToAction"] as const;
const EMAIL_PARTS = ["subject", "opening", "body", "callToAction", "signOff"] as const;

interface AiOutreachDialogProps {
  leadId: string;
  channel: Channel;
  icon?: ComponentType<{ className?: string }>;
}

export default function AiOutreachDialog({ leadId, channel, icon: TriggerIcon = Sparkles }: AiOutreachDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [versionIndex, setVersionIndex] = useState(0);

  const { data: messages, isLoading } = useOutreachMessagesByLead(open ? leadId : "");
  const channelMessages = useMemo(
    () => (messages ?? []).filter((existing) => existing.channel === channel).sort((a, b) => a.version - b.version),
    [messages, channel]
  );
  const latestMessage = channelMessages.at(-1);
  const selectedMessage = channelMessages[versionIndex];
  const maxVersion = latestMessage?.version ?? 1;
  const parts = channel === "WHATSAPP" ? WHATSAPP_PARTS : EMAIL_PARTS;

  useEffect(() => {
    if (!open || channelMessages.length === 0) {
      return;
    }

    setVersionIndex(channelMessages.length - 1);
  }, [open, channelMessages.length, latestMessage?.id]);

  const generate = useGenerateOutreachMessage();
  const rewrite = useRewriteOutreachMessage();
  const generateWhatsAppLink = useGenerateWhatsAppLink();
  const sendEmail = useSendOutreachEmail();

  const handleGenerate = () => {
    generate.mutate({ id: leadId, channel }, { onError: (error) => toast.error(getErrorMessage(error)) });
  };

  const handleRewrite = () => {
    if (!latestMessage || !prompt.trim()) {
      return;
    }

    rewrite.mutate(
      { id: latestMessage.id, prompt: prompt.trim() },
      {
        onSuccess: () => setPrompt(""),
        onError: (error) => toast.error(getErrorMessage(error))
      }
    );
  };

  const handleSend = () => {
    if (!selectedMessage) {
      return;
    }

    if (channel === "WHATSAPP") {
      generateWhatsAppLink.mutate(
        { id: selectedMessage.id },
        {
          onSuccess: (res) => window.open(res.data.link, "_blank", "noopener,noreferrer"),
          onError: (error) => toast.error(getErrorMessage(error))
        }
      );
    } else {
      sendEmail.mutate(selectedMessage.id, {
        onSuccess: () => toast.success(t("ai.outreach.emailSent")),
        onError: (error) => toast.error(getErrorMessage(error))
      });
    }
  };

  const sending = generateWhatsAppLink.isPending || sendEmail.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setPrompt("");
          setVersionIndex(0);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-primary hover:bg-primary/10 hover:text-primary"
            aria-label={t(channel === "WHATSAPP" ? "ai.outreach.whatsappTrigger" : "ai.outreach.emailTrigger")}
            onClick={(event) => event.stopPropagation()}
          >
            <TriggerIcon />
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t(channel === "WHATSAPP" ? "ai.outreach.whatsappTitle" : "ai.outreach.emailTitle")}</DialogTitle>
          <DialogDescription>{t("ai.outreach.description")}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : selectedMessage ? (
          <div className="space-y-4">
            <div className="space-y-3 rounded-lg border border-border p-3">
              <div className="flex items-center justify-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground"
                  aria-label={t("ai.outreach.previousVersion")}
                  disabled={versionIndex <= 0}
                  onClick={() => setVersionIndex((index) => Math.max(0, index - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="min-w-12 text-center text-xs font-semibold text-muted-foreground tabular-nums">
                  {t("ai.outreach.versionPager", { current: selectedMessage.version, total: maxVersion })}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground"
                  aria-label={t("ai.outreach.nextVersion")}
                  disabled={versionIndex >= channelMessages.length - 1}
                  onClick={() => setVersionIndex((index) => Math.min(channelMessages.length - 1, index + 1))}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              {parts.map((part) => (
                <div key={part}>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{t(`ai.outreach.parts.${part}`)}</p>
                  <p className="text-sm whitespace-pre-line text-foreground">{(selectedMessage.data as Record<string, string>)[part]}</p>
                </div>
              ))}
            </div>

            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={t("ai.outreach.promptPlaceholder")}
                rows={3}
                className="pe-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute inset-e-2 bottom-2 text-primary hover:bg-primary/10 hover:text-primary"
                aria-label={t("ai.outreach.rewrite")}
                disabled={!prompt.trim() || rewrite.isPending}
                onClick={handleRewrite}
              >
                {rewrite.isPending ? <Loader2 className="size-5 animate-spin" /> : <WandSparkles className="size-5" />}
              </Button>
            </div>

            <Button type="button" className="w-full" disabled={sending} onClick={handleSend}>
              {sending && <Loader2 className="animate-spin" />}
              {t(channel === "WHATSAPP" ? "ai.outreach.sendWhatsApp" : "ai.outreach.sendEmail")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6">
            <p className="text-sm text-muted-foreground">{t("ai.outreach.empty")}</p>
            <Button type="button" disabled={generate.isPending} onClick={handleGenerate}>
              {generate.isPending && <Loader2 className="animate-spin" />}
              {t("ai.outreach.generate")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
