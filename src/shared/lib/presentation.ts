export function toStatusModifier(value: string) {
  return value.replace(/_/g, "-");
}

export function formatUsd(value: number, locale?: string) {
  return `$${value.toLocaleString(locale)}`;
}

export function formatDate(value: string, locale?: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString(locale, options);
}

export function formatDateTime(value: string, locale?: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleString(locale, options);
}

export function formatTime(value: string, locale?: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleTimeString(locale, options);
}
