import type { ReactNode } from "react";
import { type AppLocale } from "@/shared/i18n/config";
import { useI18n } from "@/shared/i18n/use-i18n";
import styles from "./AppTopbar.module.css";

type AppTopbarProps = {
  title: string;
  searchSlot?: ReactNode;
};

export function AppTopbar({ title, searchSlot }: AppTopbarProps) {
  const { t, locale, setLocale } = useI18n();
  const locales: AppLocale[] = ["en", "ru"];

  return (
    <header
      className={`${styles.topbarSurface} flex items-center justify-between gap-4 border-b border-[var(--color-border)] px-6 py-5 max-[960px]:flex-col max-[960px]:items-stretch`}
    >
      <div className="grid gap-1">
        <span className="text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
          {t("topbar.kicker")}
        </span>
        <strong className="text-[28px] font-bold">{title}</strong>
      </div>

      <div className="flex items-center gap-3 max-[960px]:flex-col max-[960px]:items-stretch">
        <div
          className="inline-flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.7)] p-1"
          role="group"
          aria-label={t("topbar.languageLabel")}
        >
          {locales.map((option) => (
            <button
              key={option}
              type="button"
              className={[
                "cursor-pointer rounded-lg bg-transparent px-2.5 py-2 text-xs font-bold tracking-[0.06em] text-[var(--color-text-secondary)]",
                option === locale ? styles.localeButtonActive : "",
              ].join(" ").trim()}
              onClick={() => setLocale(option)}
            >
              {t(`common.${option}`)}
            </button>
          ))}
        </div>
        {searchSlot ? (
          searchSlot
        ) : (
          <input
            className="w-full rounded-xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.7)] px-3.5 py-3 text-[var(--color-text-primary)] md:w-80"
            type="search"
            placeholder={t("topbar.searchPlaceholder")}
            aria-label={t("topbar.searchAria")}
          />
        )}
        <span className="rounded-full border border-[rgba(107,164,255,0.28)] px-3 py-2.5 text-[13px] font-semibold text-[var(--color-accent-light-blue)]">
          {t("topbar.mockReady")}
        </span>
      </div>
    </header>
  );
}
