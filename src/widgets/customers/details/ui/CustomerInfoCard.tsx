import type { CustomerListItem } from "@/entities/customer/model/types";

type CustomerInfoCardProps = {
  customer: CustomerListItem;
  sectionTitle: string;
  labels: {
    fullName: string;
    phone: string;
    email: string;
    loyaltyTier: string;
    vehiclesCount: string;
    ordersCount: string;
    lastVisit: string;
  };
  loyaltyTierLabel: string;
  lastVisitLabel: string;
};

export const CustomerInfoCard = ({
  customer,
  sectionTitle,
  labels,
  loyaltyTierLabel,
  lastVisitLabel,
}: CustomerInfoCardProps) => {
  return (
    <article className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
      <h2 className="m-0 text-base font-bold">{sectionTitle}</h2>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {labels.fullName}
          </dt>
          <dd className="m-0">{customer.fullName}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">{labels.phone}</dt>
          <dd className="m-0">{customer.phone}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">{labels.email}</dt>
          <dd className="m-0">{customer.email}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {labels.loyaltyTier}
          </dt>
          <dd className="m-0">{loyaltyTierLabel}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {labels.vehiclesCount}
          </dt>
          <dd className="m-0">{customer.vehiclesCount}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {labels.ordersCount}
          </dt>
          <dd className="m-0">{customer.ordersCount}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">{labels.lastVisit}</dt>
          <dd className="m-0">{lastVisitLabel}</dd>
        </div>
      </dl>
    </article>
  );
};
