import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";

import {
  DEFAULT_LOCALE,
  initializeI18n,
  normalizeLocale,
  persistLocale,
  type AppLocale,
} from "./config";

type I18nContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
};

const i18n = initializeI18n();

export const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => undefined,
});

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<AppLocale>(() => normalizeLocale(i18n.resolvedLanguage ?? i18n.language));

  useEffect(() => {
    const handleLanguageChange = (nextLanguage: string) => {
      setLocaleState(normalizeLocale(nextLanguage));
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => {
        if (nextLocale === locale) {
          return;
        }

        persistLocale(nextLocale);
        void i18n.changeLanguage(nextLocale);
      },
    }),
    [locale],
  );

  return (
    <I18nContext.Provider value={value}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </I18nContext.Provider>
  );
}
