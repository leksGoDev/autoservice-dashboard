import type { AppLocale } from "@/shared/i18n/config";

export const formatCustomersRegistryDate = (
  value: string | null,
  locale: AppLocale,
  unknownLabel: string,
): string => {
  if (!value) {
    return unknownLabel;
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return unknownLabel;
  }

  return new Date(timestamp).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
