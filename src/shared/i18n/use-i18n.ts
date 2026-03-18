import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { I18nContext } from "./provider";

export function useI18n() {
  const { t } = useTranslation();
  const context = useContext(I18nContext);

  return {
    t,
    locale: context.locale,
    setLocale: context.setLocale,
  };
}
