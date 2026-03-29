import { useI18n } from "@/shared/i18n/use-i18n";

export const OrdersRegistryHeader = () => {
  const { t } = useI18n();

  return (
    <header className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
        {t("pages.orders.eyebrow")}
      </span>
      <h1 className="my-2.5 text-[28px] leading-[1.15]">{t("pages.orders.title")}</h1>
      <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.orders.description")}</p>
    </header>
  );
};
