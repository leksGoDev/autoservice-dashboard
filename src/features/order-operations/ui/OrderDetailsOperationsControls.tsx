import { ORDER_STATUSES } from "@/entities/order/model/options";
import type { OrderStatus } from "@/entities/order/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useOrderControlsModel } from "../model/use-order-controls-model";
import { LabeledSelectControl } from "./LabeledSelectControl";

type OrderDetailsOperationsControlsProps = {
  orderId: string;
  status: OrderStatus;
  assignedMechanic: string;
  flagged: boolean;
  mechanics: string[];
};

export const OrderDetailsOperationsControls = ({
  orderId,
  status,
  assignedMechanic,
  flagged,
  mechanics,
}: OrderDetailsOperationsControlsProps) => {
  const { t } = useI18n();
  const model = useOrderControlsModel({
    orderId,
    status,
    assignedMechanic,
    flagged,
    mechanics,
  });
  const statusLabel = String(t("pages.orders.operations.status"));
  const mechanicLabel = String(t("pages.orders.operations.mechanic"));

  return (
    <div className="grid gap-3">
      <LabeledSelectControl
        label={statusLabel}
        value={model.nextStatus}
        options={ORDER_STATUSES.map((statusOption) => ({
          value: statusOption,
          label: String(t(`order.status.${statusOption}`)),
        }))}
        ariaLabel={statusLabel}
        isBusy={model.isBusy}
        actionLabel={String(t("pages.orders.operations.actions.status"))}
        actionPendingLabel={String(t("pages.orders.operations.actions.statusPending"))}
        isActionPending={model.updateStatusMutation.isPending}
        isActionDisabled={!model.isStatusDirty || model.isBusy}
        onChange={model.setNextStatus}
        onAction={model.handleStatusUpdate}
      />

      <LabeledSelectControl
        label={mechanicLabel}
        value={model.nextMechanic}
        options={model.availableMechanics.map((mechanic) => ({
          value: mechanic,
          label: mechanic,
        }))}
        ariaLabel={mechanicLabel}
        isBusy={model.isBusy}
        actionLabel={String(t("pages.orders.operations.actions.mechanic"))}
        actionPendingLabel={String(t("pages.orders.operations.actions.mechanicPending"))}
        isActionPending={model.assignMechanicMutation.isPending}
        isActionDisabled={!model.isMechanicDirty || model.isBusy}
        onChange={model.setNextMechanic}
        onAction={model.handleAssignMechanic}
      />

      <button
        type="button"
        className="h-9 cursor-pointer rounded-[10px] border border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.14)] px-3 text-xs leading-4 font-medium text-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={model.handleFlagToggle}
        disabled={model.isBusy}
      >
        {String(
          model.setFlagMutation.isPending
            ? t("pages.orders.operations.actions.flagPending")
            : flagged
              ? t("pages.orders.operations.actions.unflag")
              : t("pages.orders.operations.actions.flag"),
        )}
      </button>

      {model.errorMessage ? <p className="m-0 text-xs leading-[18px] text-[#fecaca]">{model.errorMessage}</p> : null}
      {model.successMessage ? <p className="m-0 text-xs leading-[18px] text-emerald-300">{model.successMessage}</p> : null}
    </div>
  );
};
