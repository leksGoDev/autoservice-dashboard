import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { enMessages } from "./messages/en";
import { ruMessages } from "./messages/ru";

export const SUPPORTED_LOCALES = ["en", "ru"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";
export const LOCALE_STORAGE_KEY = "autoservice.locale";

const resources = {
  en: { translation: enMessages },
  ru: { translation: ruMessages },
} as const;

function toSupportedLocale(value: string | null | undefined): AppLocale | null {
  if (!value) {
    return null;
  }

  if (value === "en" || value.startsWith("en-")) {
    return "en";
  }

  if (value === "ru" || value.startsWith("ru-")) {
    return "ru";
  }

  return null;
}

export function detectInitialLocale(): AppLocale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const persistedLocale = toSupportedLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));

  if (persistedLocale) {
    return persistedLocale;
  }

  const browserLocale = toSupportedLocale(window.navigator.language);

  return browserLocale ?? DEFAULT_LOCALE;
}

export function normalizeLocale(locale: string): AppLocale {
  return toSupportedLocale(locale) ?? DEFAULT_LOCALE;
}

export function persistLocale(locale: AppLocale) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function initializeI18n() {
  if (i18n.isInitialized) {
    return i18n;
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: detectInitialLocale(),
    fallbackLng: DEFAULT_LOCALE,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n;
}
