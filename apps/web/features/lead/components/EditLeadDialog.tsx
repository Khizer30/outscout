"use client";
import { useUpdateLead } from "@features/lead/api/lead.api";
import { useLeadsContext, type Lead } from "@features/lead/components/LeadsProvider";
import { SOCIAL_PLATFORMS, STATUS_ICONS } from "@features/lead/lib/leadDisplay";
import { LeadStatusSchema } from "@repo/dtos/lead";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { Textarea } from "@shared/components/ui/textarea";
import { getErrorMessage } from "@shared/lib/error";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

type LeadStatus = z.infer<typeof LeadStatusSchema>;

interface EditLeadFormValues {
  status: LeadStatus;
  name: string;
  description: string;
  phone: string;
  emails: string;
  otherPhones: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
  whatsapp: string;
  otherLinks: string;
}

const linesToArray = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function buildDefaultValues(lead: Lead | null): EditLeadFormValues {
  return {
    status: lead?.status ?? "ENRICHING",
    name: lead?.name ?? "",
    description: lead?.description ?? "",
    phone: lead?.phone ?? "",
    emails: lead?.emails.join("\n") ?? "",
    otherPhones: lead?.otherPhones.join("\n") ?? "",
    facebook: lead?.socialLinks.facebook ?? "",
    instagram: lead?.socialLinks.instagram ?? "",
    twitter: lead?.socialLinks.twitter ?? "",
    linkedin: lead?.socialLinks.linkedin ?? "",
    tiktok: lead?.socialLinks.tiktok ?? "",
    youtube: lead?.socialLinks.youtube ?? "",
    whatsapp: lead?.socialLinks.whatsapp ?? "",
    otherLinks: lead?.socialLinks.otherLinks.join("\n") ?? ""
  };
}

export default function EditLeadDialog() {
  const { t } = useTranslation();
  const { selectedLead: lead, selectLead } = useLeadsContext();
  const updateLead = useUpdateLead();

  const { register, control, handleSubmit, reset } = useForm<EditLeadFormValues>({
    defaultValues: buildDefaultValues(lead)
  });

  useEffect(() => {
    reset(buildDefaultValues(lead));
  }, [lead, reset]);

  const onSubmit = (values: EditLeadFormValues) => {
    if (!lead) {
      return;
    }

    updateLead.mutate(
      {
        id: lead.id,
        status: values.status,
        name: values.name.trim() || null,
        description: values.description.trim() || null,
        phone: values.phone.trim() || null,
        emails: linesToArray(values.emails),
        otherPhones: linesToArray(values.otherPhones),
        socialLinks: {
          facebook: values.facebook.trim() || undefined,
          instagram: values.instagram.trim() || undefined,
          twitter: values.twitter.trim() || undefined,
          linkedin: values.linkedin.trim() || undefined,
          tiktok: values.tiktok.trim() || undefined,
          youtube: values.youtube.trim() || undefined,
          whatsapp: values.whatsapp.trim() || undefined,
          otherLinks: linesToArray(values.otherLinks)
        }
      },
      {
        onSuccess: () => {
          toast.success(t("leads.editDialog.success"));
          selectLead(null);
        },
        onError: (error) => toast.error(getErrorMessage(error))
      }
    );
  };

  return (
    <Dialog open={!!lead} onOpenChange={(open) => !open && selectLead(null)}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lead?.name || t("leads.unnamed")}</DialogTitle>
          <DialogDescription>{t("leads.editDialog.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="edit-lead-status">{t("leads.editDialog.status")}</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  items={Object.fromEntries(LeadStatusSchema.options.map((option) => [option, t(`leads.status.${option}`)]))}
                  value={field.value}
                  onValueChange={(next) => next && field.onChange(next)}
                >
                  <SelectTrigger id="edit-lead-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {LeadStatusSchema.options.map((option) => {
                      const OptionIcon = STATUS_ICONS[option];
                      return (
                        <SelectItem key={option} value={option}>
                          <OptionIcon className="size-3.5" />
                          {t(`leads.status.${option}`)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-lead-name">{t("leads.editDialog.name")}</Label>
            <Input id="edit-lead-name" placeholder={t("leads.editDialog.namePlaceholder")} {...register("name")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-lead-description">{t("leads.editDialog.descriptionLabel")}</Label>
            <Textarea id="edit-lead-description" rows={2} placeholder={t("leads.editDialog.descriptionPlaceholder")} {...register("description")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-lead-phone">{t("leads.editDialog.phone")}</Label>
            <Input id="edit-lead-phone" placeholder={t("leads.editDialog.phonePlaceholder")} {...register("phone")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-lead-other-phones">{t("leads.editDialog.otherPhones")}</Label>
            <Textarea id="edit-lead-other-phones" rows={2} placeholder={t("leads.editDialog.linesPlaceholder")} {...register("otherPhones")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-lead-emails">{t("leads.editDialog.emails")}</Label>
            <Textarea id="edit-lead-emails" rows={2} placeholder={t("leads.editDialog.linesPlaceholder")} {...register("emails")} />
          </div>

          <div className="space-y-2">
            <Label>{t("leads.editDialog.socialLinks")}</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SOCIAL_PLATFORMS.map(({ key, Icon }) => (
                <div key={key} className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <Input placeholder={t(`leads.social.${key}`)} {...register(key)} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-lead-other-links">{t("leads.editDialog.otherLinks")}</Label>
            <Textarea id="edit-lead-other-links" rows={2} placeholder={t("leads.editDialog.linesPlaceholder")} {...register("otherLinks")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose render={<Button type="button" variant="outline" />}>{t("common.cancel")}</DialogClose>
            <Button type="submit" disabled={updateLead.isPending}>
              {updateLead.isPending && <Loader2 className="size-4 animate-spin" />}
              {updateLead.isPending ? t("leads.editDialog.saving") : t("leads.editDialog.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
