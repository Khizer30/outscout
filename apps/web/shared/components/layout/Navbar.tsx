"use client";
import logoDark from "@shared/assets/images/logo_dark.webp";
import logoLight from "@shared/assets/images/logo_light.webp";
import { Button } from "@shared/components/ui/button";
import { ROUTES } from "@shared/lib/routes";
import { Languages, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.resolvedLanguage === "ar" ? "en" : "ar");
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header dir="ltr" className="flex h-20 items-center justify-between px-16">
      <Link href={ROUTES.home}>
        <Image src={logoDark} alt="Outscout" className="h-14 w-auto dark:hidden" draggable={false} priority />
        <Image src={logoLight} alt="Outscout" className="hidden h-14 w-auto dark:block" draggable={false} priority />
      </Link>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("navbar.language")}
          title={i18n.resolvedLanguage === "ar" ? t("navbar.english") : t("navbar.arabic")}
          onClick={toggleLanguage}
        >
          <Languages />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("navbar.theme")}
          title={resolvedTheme === "dark" ? t("navbar.light") : t("navbar.dark")}
          onClick={toggleTheme}
        >
          {resolvedTheme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  );
}
