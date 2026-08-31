"use client";
import { Button } from "@shared/components/ui/button";
import { cn } from "@shared/lib/utils";
import { Languages, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface AppearanceControlsProps {
  className?: string;
}

export default function AppearanceControls({ className }: AppearanceControlsProps) {
  const { t, i18n } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.resolvedLanguage === "ar" ? "en" : "ar");
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("navbar.language")}
        title={i18n.resolvedLanguage === "ar" ? t("navbar.english") : t("navbar.arabic")}
        onClick={toggleLanguage}
      >
        <Languages />
      </Button>

      <Button variant="ghost" size="icon-sm" aria-label={t("navbar.theme")} title={isDark ? t("navbar.light") : t("navbar.dark")} onClick={toggleTheme}>
        {isDark ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
}
