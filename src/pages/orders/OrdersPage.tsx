import type { FC, ReactNode } from "react";

import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
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
    content = <DataState message={t("pages.orders.states.loading")} />;
  } else if (listQuery.isError) {
    content = (
      <DataState
        message={t("pages.orders.states.error")}
        tone="error"
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={() => listQuery.refetch()}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  } else if (rows.length === 0) {
    content = <DataState message={t("pages.orders.states.empty")} />;
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
    <section className="grid gap-5">
      <header className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
          {t("pages.orders.eyebrow")}
        </span>
        <h1 className="my-[10px] text-[28px] leading-[1.15]">{t("pages.orders.title")}</h1>
        <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.orders.description")}</p>
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
