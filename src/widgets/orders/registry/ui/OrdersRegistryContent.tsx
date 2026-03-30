import { useCallback } from "react";

import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { OrderRowFlagControl } from "@/features/order-operations/ui/OrderRowFlagControl";
import { OrderRowMechanicControl } from "@/features/order-operations/ui/OrderRowMechanicControl";
import { OrderRowStatusControl } from "@/features/order-operations/ui/OrderRowStatusControl";
import { OrdersTable } from "@/widgets/orders/table/OrdersTable";
import type { OrdersRegistryModel } from "../hooks/use-orders-registry-model";

type OrdersRegistryContentProps = {
  model: OrdersRegistryModel;
};

export const OrdersRegistryContent = ({ model }: OrdersRegistryContentProps) => {
  const { t } = useI18n();
  const renderStatusCell = useCallback(
    (order: OrdersRegistryModel["rows"][number]) => (
      <OrderRowStatusControl orderId={order.id} status={order.status} />
    ),
    [],
  );
  const renderMechanicCell = useCallback(
    (order: OrdersRegistryModel["rows"][number]) => (
      <OrderRowMechanicControl
        orderId={order.id}
        assignedMechanic={order.assignedMechanic}
        mechanics={model.mechanics}
      />
    ),
    [model.mechanics],
  );
  const renderRowActions = useCallback(
    (order: OrdersRegistryModel["rows"][number]) => (
      <OrderRowFlagControl orderId={order.id} flagged={order.flagged} />
    ),
    [],
  );

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
            className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 text-xs leading-4 font-medium text-[var(--color-text-primary)]"
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
      renderStatusCell={renderStatusCell}
      renderMechanicCell={renderMechanicCell}
      renderRowActions={renderRowActions}
    />
  );
};
