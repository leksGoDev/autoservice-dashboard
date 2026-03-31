import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/shared/i18n/use-i18n";

type CustomerDetailsHeaderProps = {
  customerId: string | undefined;
};

export const CustomerDetailsHeader = ({ customerId }: CustomerDetailsHeaderProps) => {
  const { t } = useI18n();

  return (
    <header className="grid gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
        {t("pages.customerDetails.eyebrow")}
      </span>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="m-0 text-[28px] leading-[1.15]">{t("pages.customerDetails.title")}</h1>
          <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.customerDetails.description")}</p>
          <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.customerDetails.customerId", { customerId })}</p>
        </div>
        <Link
          to="/customers"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.14)] px-4 text-sm font-semibold text-[var(--color-accent-light-blue)] transition-colors hover:bg-[rgba(107,164,255,0.2)]"
        >
          <ArrowLeft size={14} strokeWidth={2} aria-hidden className="shrink-0 opacity-90" />
          {t("pages.customerDetails.back")}
        </Link>
      </div>
    </header>
  );
};
