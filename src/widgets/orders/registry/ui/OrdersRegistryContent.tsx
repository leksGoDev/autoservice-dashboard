import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { OrderOperationsControls } from "@/features/order-operations/ui/OrderOperationsControls";
import { OrdersTable } from "@/widgets/orders/table/OrdersTable";
import type { OrdersRegistryModel } from "../hooks/use-orders-registry-model";

type OrdersRegistryContentProps = {
  model: OrdersRegistryModel;
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
      renderRowActions={(order) => (
        <OrderOperationsControls
          orderId={order.id}
          status={order.status}
          assignedMechanic={order.assignedMechanic}
          flagged={order.flagged}
          mechanics={model.mechanics}
          variant="table"
        />
      )}
    />
  );
};
