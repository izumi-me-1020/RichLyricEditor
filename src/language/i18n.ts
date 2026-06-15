import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ja from "./locales/ja.json";

const SUPPORTED_LANGUAGES = ["en", "ja"] as const;

function normalizeLanguageTag(language: string | undefined): string {
  return language?.toLowerCase().split("-")[0] ?? "en";
}

function resolveAppLanguage(preferredLanguage: string): string {
  if (preferredLanguage !== "auto") return preferredLanguage;
  if (typeof navigator === "undefined") return "en";
  const detected = normalizeLanguageTag(navigator.language);
  return SUPPORTED_LANGUAGES.includes(detected as (typeof SUPPORTED_LANGUAGES)[number])
    ? detected
    : "en";
}

void i18n.use(initReactI18next).init({
  resources: {
    ja: {
      translation: ja,
    },
  },
  lng: "en",
  fallbackLng: false,
  returnNull: false,
  returnEmptyString: false,
  interpolation: {
    escapeValue: false,
  },
});

export const t = i18n.t.bind(i18n);

export { resolveAppLanguage };
export default i18n;
