import { Link } from "react-router-dom";

import { useI18n } from "@/shared/i18n/use-i18n";
import { headerPrimaryActionButtonClassName } from "@/shared/ui/class-names";

export const OrdersRegistryHeader = () => {
  const { t } = useI18n();

  return (
    <header className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-2.5">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
            {t("pages.orders.eyebrow")}
          </span>
          <h1 className="m-0 text-[28px] leading-[1.15]">{t("pages.orders.title")}</h1>
          <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.orders.description")}</p>
        </div>

        <Link
          to="/orders/new"
          className={headerPrimaryActionButtonClassName}
        >
          {t("pages.orders.toolbar.create")}
        </Link>
      </div>
    </header>
  );
};
