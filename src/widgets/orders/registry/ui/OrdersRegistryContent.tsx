import type { OrdersTableRow } from "@/widgets/orders/shared/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { OrdersTable } from "@/widgets/orders/table/OrdersTable";

type OrdersRegistryContentProps = {
  rows: OrdersTableRow[];
  page: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onPageChange: (nextPage: number) => void;
  onRetry: () => void;
};

export const OrdersRegistryContent = ({
  rows,
  page,
  total,
  totalPages,
  isLoading,
  isError,
  isFetching,
  onPageChange,
  onRetry,
}: OrdersRegistryContentProps) => {
  const { t } = useI18n();

  if (isLoading) {
    return <DataState message={t("pages.orders.states.loading")} />;
  }

  if (isError) {
    return (
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
    );
  }

  if (rows.length === 0) {
    return <DataState message={t("pages.orders.states.empty")} />;
  }

  return (
    <OrdersTable
      items={rows}
      page={page}
      totalPages={totalPages}
      total={total}
      isFetching={isFetching}
      onPageChange={onPageChange}
    />
  );
};
