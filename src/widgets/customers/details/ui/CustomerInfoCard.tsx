import type { CustomerListItem } from "@/entities/customer/model/types";
import { formatCustomerDetailsDate } from "@/entities/customer/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";

type CustomerInfoCardProps = {
  customer: CustomerListItem;
  onEdit?: () => void;
};

export const CustomerInfoCard = ({ customer, onEdit }: CustomerInfoCardProps) => {
  const { t, locale } = useI18n();

  return (
    <article className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="m-0 text-base font-bold">{t("pages.customerDetails.sections.info")}</h2>
        {onEdit ? (
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.16)] px-3 text-xs leading-4 font-medium text-[var(--color-accent-light-blue)]"
            onClick={onEdit}
          >
            {t("pages.customerDetails.actions.edit")}
          </button>
        ) : null}
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <dt className="m-0 text-xs uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.customerDetails.labels.fullName")}
          </dt>
          <dd className="m-0">{customer.fullName}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-xs uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">{t("pages.customerDetails.labels.phone")}</dt>
          <dd className="m-0">{customer.phone}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-xs uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">{t("pages.customerDetails.labels.email")}</dt>
          <dd className="m-0">{customer.email}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-xs uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.customerDetails.labels.loyaltyTier")}
          </dt>
          <dd className="m-0">{t(`customer.loyaltyTier.${customer.loyaltyTier}`)}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-xs uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.customerDetails.labels.vehiclesCount")}
          </dt>
          <dd className="m-0">{customer.vehiclesCount}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-xs uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.customerDetails.labels.ordersCount")}
          </dt>
          <dd className="m-0">{customer.ordersCount}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-xs uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">{t("pages.customerDetails.labels.lastVisit")}</dt>
          <dd className="m-0">{formatCustomerDetailsDate(customer.lastVisitAt, locale, t("common.unknown"))}</dd>
        </div>
      </dl>
    </article>
  );
};
