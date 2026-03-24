import type { OrderDetailsInfoListItem } from "../model/types";

type OrderDetailsInfoListProps = {
  items: OrderDetailsInfoListItem[];
};

export const OrderDetailsInfoList = ({ items }: OrderDetailsInfoListProps) => {
  return (
    <dl className="grid gap-3">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {item.label}
          </dt>
          <dd className="m-0 text-sm text-[var(--color-text-primary)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};
