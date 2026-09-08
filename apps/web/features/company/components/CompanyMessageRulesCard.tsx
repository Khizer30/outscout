"use client";
import { useCompanySettingsContext } from "@features/company/components/CompanySettingsProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Label } from "@shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/ui/tabs";
import { Textarea } from "@shared/components/ui/textarea";
import { useTranslation } from "react-i18next";

export default function CompanyMessageRulesCard() {
  const { t } = useTranslation();
  const { register, errors } = useCompanySettingsContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("companySettings.rules.title")}</CardTitle>
        <CardDescription>{t("companySettings.rules.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="whatsapp">
          <TabsList>
            <TabsTrigger value="whatsapp">{t("companySettings.rules.whatsapp")}</TabsTrigger>
            <TabsTrigger value="email">{t("companySettings.rules.email")}</TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="company-settings-whatsapp-greeting">{t("companySettings.rules.greeting")}</Label>
              <Textarea
                id="company-settings-whatsapp-greeting"
                rows={2}
                placeholder={t("companySettings.rules.greetingPlaceholder")}
                aria-invalid={!!errors.whatsappGreeting}
                {...register("whatsappGreeting")}
              />
              <p className="min-h-4 text-xs text-destructive">{errors.whatsappGreeting?.message && t(`errors:${errors.whatsappGreeting.message}`)}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company-settings-whatsapp-rules">{t("companySettings.rules.rules")}</Label>
              <Textarea
                id="company-settings-whatsapp-rules"
                rows={4}
                placeholder={t("companySettings.rules.rulesPlaceholder")}
                aria-invalid={!!errors.whatsappRules}
                {...register("whatsappRules")}
              />
              <p className="min-h-4 text-xs text-destructive">{errors.whatsappRules?.message && t(`errors:${errors.whatsappRules.message}`)}</p>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="company-settings-email-greeting">{t("companySettings.rules.greeting")}</Label>
              <Textarea
                id="company-settings-email-greeting"
                rows={2}
                placeholder={t("companySettings.rules.greetingPlaceholder")}
                aria-invalid={!!errors.emailGreeting}
                {...register("emailGreeting")}
              />
              <p className="min-h-4 text-xs text-destructive">{errors.emailGreeting?.message && t(`errors:${errors.emailGreeting.message}`)}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company-settings-email-rules">{t("companySettings.rules.rules")}</Label>
              <Textarea
                id="company-settings-email-rules"
                rows={4}
                placeholder={t("companySettings.rules.rulesPlaceholder")}
                aria-invalid={!!errors.emailRules}
                {...register("emailRules")}
              />
              <p className="min-h-4 text-xs text-destructive">{errors.emailRules?.message && t(`errors:${errors.emailRules.message}`)}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
