import type { ChangeEvent, FC } from "react";

import { useI18n } from "@/shared/i18n/use-i18n";
import { ORDER_PRIORITIES, ORDER_STATUSES } from "@/widgets/orders-shared/model/options";
import type { OrdersToolbarFilters } from "@/widgets/orders-shared/model/types";

interface OrdersToolbarProps {
  filters: OrdersToolbarFilters;
  mechanics: string[];
  onChange: (next: Partial<OrdersToolbarFilters>) => void;
  onReset: () => void;
}

export const OrdersToolbar: FC<OrdersToolbarProps> = ({ filters, mechanics, onChange, onReset }) => {
  const { t } = useI18n();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ search: event.target.value });
  };

  const handleSelectChange =
    <T extends keyof Omit<OrdersToolbarFilters, "search">>(field: T) =>
    (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      onChange({ [field]: event.target.value } as Partial<OrdersToolbarFilters>);
    };

  return (
    <section
      className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4"
      aria-label={t("pages.orders.toolbar.aria") as string}
    >
      <div className="grid gap-3 min-[1241px]:grid-cols-6 max-[1240px]:grid-cols-3 max-[767px]:grid-cols-1">
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orders.toolbar.search")}
          </span>
          <input
            type="search"
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-[var(--color-text-primary)]"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder={t("pages.orders.toolbar.searchPlaceholder") as string}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orders.toolbar.status")}
          </span>
          <select
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-[var(--color-text-primary)]"
            value={filters.status}
            onChange={handleSelectChange("status")}
          >
            <option value="">{t("pages.orders.toolbar.all")}</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`order.status.${status}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orders.toolbar.priority")}
          </span>
          <select
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-[var(--color-text-primary)]"
            value={filters.priority}
            onChange={handleSelectChange("priority")}
          >
            <option value="">{t("pages.orders.toolbar.all")}</option>
            {ORDER_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {t(`order.priority.${priority}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orders.toolbar.mechanic")}
          </span>
          <select
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-[var(--color-text-primary)]"
            value={filters.mechanic}
            onChange={handleSelectChange("mechanic")}
          >
            <option value="">{t("pages.orders.toolbar.all")}</option>
            {mechanics.map((mechanic) => (
              <option key={mechanic} value={mechanic}>
                {mechanic}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orders.toolbar.createdFrom")}
          </span>
          <input
            type="date"
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-[var(--color-text-primary)]"
            value={filters.createdFrom}
            onChange={handleSelectChange("createdFrom")}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orders.toolbar.createdTo")}
          </span>
          <input
            type="date"
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-[var(--color-text-primary)]"
            value={filters.createdTo}
            onChange={handleSelectChange("createdTo")}
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-3 py-2 text-[var(--color-text-primary)]"
          onClick={onReset}
        >
          {t("pages.orders.toolbar.reset")}
        </button>
      </div>
    </section>
  );
};
