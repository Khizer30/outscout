import arCommon from "@locales/ar/common.json";
import arErrors from "@locales/ar/errors.json";
import enCommon from "@locales/en/common.json";
import enErrors from "@locales/en/errors.json";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

export const defaultNS = "common";
export const supportedLngs = ["en", "ar"] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs,
    defaultNS,
    resources: {
      en: { common: enCommon, errors: enErrors },
      ar: { common: arCommon, errors: arErrors }
    },
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"]
    }
  });

export default i18n;
