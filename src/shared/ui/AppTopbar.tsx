import { type AppLocale } from "@/shared/i18n/config";
import { useI18n } from "@/shared/i18n/use-i18n";

type AppTopbarProps = {
  title: string;
};

export function AppTopbar({ title }: AppTopbarProps) {
  const { t, locale, setLocale } = useI18n();
  const locales: AppLocale[] = ["en", "ru"];

  return (
    <header className="topbar">
      <div className="topbar__meta">
        <span className="topbar__kicker">{t("topbar.kicker")}</span>
        <strong className="topbar__title">{title}</strong>
      </div>

      <div className="topbar__controls">
        <div className="topbar__locale" role="group" aria-label={t("topbar.languageLabel")}>
          {locales.map((option) => (
            <button
              key={option}
              type="button"
              className={`topbar__locale-button${option === locale ? " topbar__locale-button--active" : ""}`}
              onClick={() => setLocale(option)}
            >
              {t(`common.${option}`)}
            </button>
          ))}
        </div>
        <input
          className="topbar__search"
          type="search"
          placeholder={t("topbar.searchPlaceholder")}
          aria-label={t("topbar.searchAria")}
        />
        <span className="topbar__pill">{t("topbar.mockReady")}</span>
      </div>
    </header>
  );
}
