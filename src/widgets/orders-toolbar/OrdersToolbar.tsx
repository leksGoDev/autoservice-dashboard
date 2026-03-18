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
    <section className="orders-toolbar" aria-label={t("pages.orders.toolbar.aria") as string}>
      <div className="orders-toolbar__grid">
        <label className="orders-toolbar__field">
          <span className="orders-toolbar__label">{t("pages.orders.toolbar.search")}</span>
          <input
            type="search"
            className="orders-toolbar__input"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder={t("pages.orders.toolbar.searchPlaceholder") as string}
          />
        </label>

        <label className="orders-toolbar__field">
          <span className="orders-toolbar__label">{t("pages.orders.toolbar.status")}</span>
          <select
            className="orders-toolbar__select"
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

        <label className="orders-toolbar__field">
          <span className="orders-toolbar__label">{t("pages.orders.toolbar.priority")}</span>
          <select
            className="orders-toolbar__select"
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

        <label className="orders-toolbar__field">
          <span className="orders-toolbar__label">{t("pages.orders.toolbar.mechanic")}</span>
          <select
            className="orders-toolbar__select"
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

        <label className="orders-toolbar__field">
          <span className="orders-toolbar__label">{t("pages.orders.toolbar.createdFrom")}</span>
          <input
            type="date"
            className="orders-toolbar__input"
            value={filters.createdFrom}
            onChange={handleSelectChange("createdFrom")}
          />
        </label>

        <label className="orders-toolbar__field">
          <span className="orders-toolbar__label">{t("pages.orders.toolbar.createdTo")}</span>
          <input
            type="date"
            className="orders-toolbar__input"
            value={filters.createdTo}
            onChange={handleSelectChange("createdTo")}
          />
        </label>
      </div>

      <div className="orders-toolbar__actions">
        <button type="button" className="orders-toolbar__reset" onClick={onReset}>
          {t("pages.orders.toolbar.reset")}
        </button>
      </div>
    </section>
  );
};
