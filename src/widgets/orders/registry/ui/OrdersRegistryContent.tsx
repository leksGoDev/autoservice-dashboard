import { useCallback } from "react";
import { RotateCcw } from "lucide-react";

import { useI18n } from "@/shared/i18n/use-i18n";
import { primaryActionButtonClassName } from "@/shared/ui/class-names";
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
            className={`${primaryActionButtonClassName} gap-1.5`}
            onClick={() => model.listQuery.refetch()}
          >
            <RotateCcw size={14} strokeWidth={2} aria-hidden className="shrink-0 opacity-90" />
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
