import { Link } from "react-router-dom";

import { useI18n } from "@/shared/i18n/use-i18n";

type OrderDetailsHeaderProps = {
  orderId?: string;
};

export const OrderDetailsHeader = ({ orderId }: OrderDetailsHeaderProps) => {
  const { t } = useI18n();

  return (
    <header className="grid gap-[10px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
        {t("pages.orderDetails.eyebrow")}
      </span>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="m-0 text-[28px] leading-[1.15]">{t("pages.orderDetails.title")}</h1>
          <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.orderDetails.description")}</p>
          <p className="m-0 text-sm text-[var(--color-text-secondary)]">
            {t("pages.orderDetails.orderId", { orderId })}
          </p>
        </div>
        <Link
          to="/orders"
          className="inline-flex h-fit rounded-full border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.14)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--color-accent-light-blue)] transition-colors hover:bg-[rgba(107,164,255,0.2)]"
        >
          {t("pages.orderDetails.back")}
        </Link>
      </div>
    </header>
  );
};
