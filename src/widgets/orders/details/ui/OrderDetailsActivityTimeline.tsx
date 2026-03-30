import type { OrderActivityItem } from "@/entities/order/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { primaryActionButtonClassName } from "@/shared/ui/class-names";
import { formatOrderActivityTimestamp } from "../model/presentation";

type OrderDetailsActivityTimelineProps = {
  items: OrderActivityItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export const OrderDetailsActivityTimeline = ({
  items,
  isLoading,
  isError,
  onRetry,
}: OrderDetailsActivityTimelineProps) => {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <p className="m-0 text-sm text-[var(--color-text-secondary)]">{t("pages.orderDetails.states.loadingActivity")}</p>
    );
  }

  if (isError) {
    return (
      <div className="grid gap-3">
        <p className="m-0 text-sm text-[#fecaca]">{t("pages.orderDetails.states.activityError")}</p>
        <button
          type="button"
          className={`justify-self-start ${primaryActionButtonClassName}`}
          onClick={onRetry}
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="m-0 text-sm text-[var(--color-text-secondary)]">{t("pages.orderDetails.states.emptyActivity")}</p>
    );
  }

  return (
    <ol className="m-0 grid list-none gap-3 p-0">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid gap-2 rounded-xl border border-[rgba(154,164,178,0.12)] bg-[rgba(15,17,21,0.42)] px-4 py-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {t(`pages.orderDetails.activity.types.${item.type}`)}
            </span>
            <time className="text-xs text-[var(--color-text-secondary)]">
              {formatOrderActivityTimestamp(item.timestamp)}
            </time>
          </div>
          <p className="m-0 text-sm text-[var(--color-text-secondary)]">{item.description}</p>
          <span className="text-xs uppercase tracking-[0.08em] text-[var(--color-accent-light-blue)]">{item.actor}</span>
        </li>
      ))}
    </ol>
  );
};
