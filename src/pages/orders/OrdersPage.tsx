import "./orders.css";

import type { FC, ReactNode } from "react";

import { useI18n } from "@/shared/i18n/use-i18n";
import { OrdersTable } from "@/widgets/orders-table/OrdersTable";
import { OrdersToolbar } from "@/widgets/orders-toolbar/OrdersToolbar";
import { useOrdersPageModel } from "./model/use-orders-page-model";

interface OrdersPageProps {}

export const OrdersPage: FC<OrdersPageProps> = () => {
  const { t } = useI18n();
  const {
    filters,
    listQuery,
    mechanics,
    rows,
    page,
    total,
    totalPages,
    onToolbarChange,
    onResetFilters,
    onPageChange,
  } = useOrdersPageModel();

  let content: ReactNode;

  if (listQuery.isLoading) {
    content = <section className="orders-state">{t("pages.orders.states.loading")}</section>;
  } else if (listQuery.isError) {
    content = (
      <section className="orders-state orders-state--error">
        {t("pages.orders.states.error")}
        <button type="button" className="orders-state__retry" onClick={() => listQuery.refetch()}>
          {t("common.retry")}
        </button>
      </section>
    );
  } else if (rows.length === 0) {
    content = <section className="orders-state">{t("pages.orders.states.empty")}</section>;
  } else {
    content = (
      <OrdersTable
        items={rows}
        page={page}
        totalPages={totalPages}
        total={total}
        isFetching={listQuery.isFetching}
        onPageChange={onPageChange}
      />
    );
  }

  return (
    <section className="orders-page">
      <header className="orders-page__hero">
        <span className="orders-page__eyebrow">{t("pages.orders.eyebrow")}</span>
        <h1 className="orders-page__title">{t("pages.orders.title")}</h1>
        <p className="orders-page__description">{t("pages.orders.description")}</p>
      </header>

      <OrdersToolbar
        filters={filters}
        mechanics={mechanics}
        onChange={onToolbarChange}
        onReset={onResetFilters}
      />

      {content}
    </section>
  );
};
