import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { OrdersTable } from "@/widgets/orders/table/OrdersTable";
import type { useOrdersRegistryModel } from "../model/use-orders-registry-model";

type OrdersRegistryContentProps = {
  model: ReturnType<typeof useOrdersRegistryModel>;
};

export const OrdersRegistryContent = ({ model }: OrdersRegistryContentProps) => {
  const { t } = useI18n();

  if (model.listQuery.isLoading) {
    return <DataState message={t("pages.orders.states.loading")} />;
  }

  if (model.listQuery.isError) {
    return (
      <DataState
        message={t("pages.orders.states.error")}
        tone="error"
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={() => model.listQuery.refetch()}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (model.rows.length === 0) {
    return <DataState message={t("pages.orders.states.empty")} />;
  }

  return (
    <OrdersTable
      items={model.rows}
      page={model.page}
      totalPages={model.totalPages}
      total={model.total}
      isFetching={model.listQuery.isFetching}
      onPageChange={model.onPageChange}
    />
  );
};
