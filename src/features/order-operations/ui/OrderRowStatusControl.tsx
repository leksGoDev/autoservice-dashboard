import { useEffect, useState } from "react";

import { ORDER_STATUSES } from "@/entities/order/model/options";
import type { OrderStatus } from "@/entities/order/model/types";
import { useUpdateOrderStatusMutation } from "@/features/order-operations/api/mutations";
import { useI18n } from "@/shared/i18n/use-i18n";
import { InlineSelectControl } from "./InlineSelectControl";

type OrderRowStatusControlProps = {
  orderId: string;
  status: OrderStatus;
};

export const OrderRowStatusControl = ({ orderId, status }: OrderRowStatusControlProps) => {
  const { t } = useI18n();
  const mutation = useUpdateOrderStatusMutation();
  const [nextStatus, setNextStatus] = useState<OrderStatus>(status);

  useEffect(() => {
    setNextStatus(status);
  }, [status]);

  const isDirty = nextStatus !== status;
  const statusLabel = String(t("pages.orders.operations.status"));
  const statusPendingLabel = String(t("pages.orders.operations.actions.statusPending"));
  const statusActionLabel = String(t("pages.orders.operations.actions.status"));

  const handleSubmit = async () => {
    await mutation.mutateAsync({
      orderId,
      status: nextStatus,
    });
  };

  return (
    <InlineSelectControl
      value={nextStatus}
      options={ORDER_STATUSES.map((statusOption) => ({
        value: statusOption,
        label: String(t(`order.status.${statusOption}`)),
      }))}
      ariaLabel={statusLabel}
      isBusy={mutation.isPending}
      isDirty={isDirty}
      isPending={mutation.isPending}
      pendingLabel={statusPendingLabel}
      actionLabel={statusActionLabel}
      onChange={setNextStatus}
      onSubmit={handleSubmit}
    />
  );
};
