import type { OrdersToolbarFilters } from "@/widgets/orders-shared/model/types";
import type { OrdersTableRow } from "@/widgets/orders-shared/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { OrdersTable } from "@/widgets/orders-table/OrdersTable";
import { OrdersToolbar } from "@/widgets/orders-toolbar/OrdersToolbar";

type OrdersRegistryProps = {
  filters: OrdersToolbarFilters;
  mechanics: string[];
  rows: OrdersTableRow[];
  page: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onToolbarChange: (next: Partial<OrdersToolbarFilters>) => void;
  onResetFilters: () => void;
  onPageChange: (nextPage: number) => void;
  onRetry: () => void;
};

export const OrdersRegistry = ({
  filters,
  mechanics,
  rows,
  page,
  total,
  totalPages,
  isLoading,
  isError,
  isFetching,
  onToolbarChange,
  onResetFilters,
  onPageChange,
  onRetry,
}: OrdersRegistryProps) => {
  const { t } = useI18n();

  return (
    <section className="grid gap-5">
      <header className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
          {t("pages.orders.eyebrow")}
        </span>
        <h1 className="my-[10px] text-[28px] leading-[1.15]">{t("pages.orders.title")}</h1>
        <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.orders.description")}</p>
      </header>

      <OrdersToolbar filters={filters} mechanics={mechanics} onChange={onToolbarChange} onReset={onResetFilters} />

      {isLoading ? <DataState message={t("pages.orders.states.loading")} /> : null}

      {isError ? (
        <DataState
          message={t("pages.orders.states.error")}
          tone="error"
          action={
            <button
              type="button"
              className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
              onClick={onRetry}
            >
              {t("common.retry")}
            </button>
          }
        />
      ) : null}

      {!isLoading && !isError && rows.length === 0 ? (
        <DataState message={t("pages.orders.states.empty")} />
      ) : null}

      {!isLoading && !isError && rows.length > 0 ? (
        <OrdersTable
          items={rows}
          page={page}
          totalPages={totalPages}
          total={total}
          isFetching={isFetching}
          onPageChange={onPageChange}
        />
      ) : null}
    </section>
  );
};
