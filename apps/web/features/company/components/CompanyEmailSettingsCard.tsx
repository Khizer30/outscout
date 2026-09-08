"use client";
import { useCompanySettingsContext } from "@features/company/components/CompanySettingsProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import { useTranslation } from "react-i18next";

export default function CompanyEmailSettingsCard() {
  const { t } = useTranslation();
  const { settings, register, errors, watch, setValue } = useCompanySettingsContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("companySettings.email.title")}</CardTitle>
        <CardDescription>{t("companySettings.email.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="company-settings-from-email">{t("companySettings.email.fromEmail")}</Label>
            <Input
              id="company-settings-from-email"
              type="email"
              placeholder={t("companySettings.email.fromEmailPlaceholder")}
              aria-invalid={!!errors.fromEmail}
              {...register("fromEmail")}
            />
            <p className="min-h-4 text-xs text-destructive">{errors.fromEmail?.message && t(`errors:${errors.fromEmail.message}`)}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-settings-api-key">{t("companySettings.email.apiKey")}</Label>
            <Input
              id="company-settings-api-key"
              type="password"
              autoComplete="off"
              placeholder={
                settings.emailSettings.hasBrevoApiKey ? t("companySettings.email.apiKeyConfiguredPlaceholder") : t("companySettings.email.apiKeyPlaceholder")
              }
              aria-invalid={!!errors.brevoApiKey}
              {...register("brevoApiKey")}
            />
            <p className="min-h-4 text-xs text-muted-foreground">{t("companySettings.email.apiKeyHint")}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company-settings-signature">{t("companySettings.email.signature")}</Label>
          <Textarea
            id="company-settings-signature"
            rows={3}
            placeholder={t("companySettings.email.signaturePlaceholder")}
            aria-invalid={!!errors.emailSignature}
            {...register("emailSignature")}
          />
          <p className="min-h-4 text-xs text-destructive">{errors.emailSignature?.message && t(`errors:${errors.emailSignature.message}`)}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="company-settings-primary-color">{t("companySettings.email.primaryColor")}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label={t("companySettings.email.primaryColor")}
                value={/^#[0-9a-fA-F]{6}$/.test(watch("primaryColor")) ? watch("primaryColor") : "#000000"}
                onChange={(event) => setValue("primaryColor", event.target.value, { shouldDirty: true })}
                className="size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1"
              />
              <Input id="company-settings-primary-color" placeholder="#000000" aria-invalid={!!errors.primaryColor} {...register("primaryColor")} />
            </div>
            <p className="min-h-4 text-xs text-destructive">{errors.primaryColor?.message && t(`errors:${errors.primaryColor.message}`)}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-settings-secondary-color">{t("companySettings.email.secondaryColor")}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label={t("companySettings.email.secondaryColor")}
                value={/^#[0-9a-fA-F]{6}$/.test(watch("secondaryColor")) ? watch("secondaryColor") : "#000000"}
                onChange={(event) => setValue("secondaryColor", event.target.value, { shouldDirty: true })}
                className="size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1"
              />
              <Input id="company-settings-secondary-color" placeholder="#000000" aria-invalid={!!errors.secondaryColor} {...register("secondaryColor")} />
            </div>
            <p className="min-h-4 text-xs text-destructive">{errors.secondaryColor?.message && t(`errors:${errors.secondaryColor.message}`)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
