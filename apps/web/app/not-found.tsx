"use client";
import { ROUTES } from "@shared/lib/routes";
import { MapPinOff } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MapPinOff className="size-10" strokeWidth={1.5} />
      </div>

      <div className="space-y-2">
        <h1 className="text-6xl font-bold tracking-tight text-foreground">{t("notFound.code")}</h1>
        <p className="text-lg font-medium text-foreground">{t("notFound.title")}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{t("notFound.description")}</p>
      </div>

      <Link
        href={ROUTES.home}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {t("notFound.backToHome")}
      </Link>
    </div>
  );
}
