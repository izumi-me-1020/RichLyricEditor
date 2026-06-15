import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ja from "./locales/ja.json";

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

export default i18n;
