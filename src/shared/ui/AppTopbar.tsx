import { type AppLocale } from "@/shared/i18n/config";
import { useI18n } from "@/shared/i18n/use-i18n";
import styles from "./AppTopbar.module.css";

type AppTopbarProps = {
  title: string;
};

export function AppTopbar({ title }: AppTopbarProps) {
  const { t, locale, setLocale } = useI18n();
  const locales: AppLocale[] = ["en", "ru"];

  return (
    <header className={styles.topbar}>
      <div className={styles.meta}>
        <span className={styles.kicker}>{t("topbar.kicker")}</span>
        <strong className={styles.title}>{title}</strong>
      </div>

      <div className={styles.controls}>
        <div className={styles.locale} role="group" aria-label={t("topbar.languageLabel")}>
          {locales.map((option) => (
            <button
              key={option}
              type="button"
              className={option === locale ? `${styles.localeButton} ${styles.localeButtonActive}` : styles.localeButton}
              onClick={() => setLocale(option)}
            >
              {t(`common.${option}`)}
            </button>
          ))}
        </div>
        <input
          className={styles.search}
          type="search"
          placeholder={t("topbar.searchPlaceholder")}
          aria-label={t("topbar.searchAria")}
        />
        <span className={styles.pill}>{t("topbar.mockReady")}</span>
      </div>
    </header>
  );
}
