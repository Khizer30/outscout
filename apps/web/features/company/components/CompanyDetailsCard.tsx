"use client";
import { useCompanySettingsContext } from "@features/company/components/CompanySettingsProvider";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import { Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function CompanyDetailsCard() {
  const { t } = useTranslation();
  const { register, errors, watch, companyImageURL, uploading, fileInputRef, handlePickFile, handleFileChange, handleRemoveImage } =
    useCompanySettingsContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("companySettings.details.title")}</CardTitle>
        <CardDescription>{t("companySettings.details.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-2xl font-medium text-primary">
            {companyImageURL ? (
              <Image src={companyImageURL} alt={watch("name") || "Company"} fill sizes="80px" unoptimized className="object-cover" draggable={false} />
            ) : (
              (watch("name")?.charAt(0).toUpperCase() ?? "?")
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="size-5 animate-spin text-white" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handlePickFile} disabled={uploading}>
                <Upload className="size-4" />
                {t("companySettings.details.uploadImage")}
              </Button>
              {companyImageURL && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                  {t("companySettings.details.removeImage")}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{t("companySettings.details.imageHint")}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company-settings-name">{t("companySettings.details.name")}</Label>
          <Input id="company-settings-name" aria-invalid={!!errors.name} {...register("name")} />
          <p className="min-h-4 text-xs text-destructive">{errors.name?.message && t(`errors:${errors.name.message}`)}</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company-settings-about">{t("companySettings.details.about")}</Label>
          <Textarea
            id="company-settings-about"
            rows={3}
            placeholder={t("companySettings.details.aboutPlaceholder")}
            aria-invalid={!!errors.about}
            {...register("about")}
          />
          <p className="min-h-4 text-xs text-destructive">{errors.about?.message && t(`errors:${errors.about.message}`)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
