import { ORDER_STATUSES } from "@/entities/order/model/options";
import type { OrderStatus } from "@/entities/order/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useOrderOperationsControlsModel } from "../model/use-order-operations-model";

type OrderOperationsControlsProps = {
  orderId: string;
  status: OrderStatus;
  assignedMechanic: string;
  flagged: boolean;
  mechanics: string[];
  variant?: "table" | "details";
};

export const OrderOperationsControls = ({
  orderId,
  status,
  assignedMechanic,
  flagged,
  mechanics,
  variant = "table",
}: OrderOperationsControlsProps) => {
  const { t } = useI18n();
  const model = useOrderOperationsControlsModel({
    orderId,
    status,
    assignedMechanic,
    flagged,
    mechanics,
  });

  return (
    <div className={variant === "details" ? "grid gap-3" : "grid gap-2"}>
      <div className={variant === "details" ? "grid gap-2 sm:grid-cols-[1fr_auto]" : "grid gap-2"}>
        <label className="grid gap-1">
          <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orders.operations.status")}
          </span>
          <select
            value={model.nextStatus}
            onChange={(event) => model.setNextStatus(event.target.value as OrderStatus)}
            disabled={model.isBusy}
            className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
            aria-label={t("pages.orders.operations.status") as string}
          >
            {ORDER_STATUSES.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {t(`order.status.${statusOption}`)}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-3 py-2 text-xs text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={model.handleStatusUpdate}
          disabled={!model.isStatusDirty || model.isBusy}
        >
          {model.updateStatusMutation.isPending
            ? t("pages.orders.operations.actions.statusPending")
            : t("pages.orders.operations.actions.status")}
        </button>
      </div>

      <div className={variant === "details" ? "grid gap-2 sm:grid-cols-[1fr_auto]" : "grid gap-2"}>
        <label className="grid gap-1">
          <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orders.operations.mechanic")}
          </span>
          <select
            value={model.nextMechanic}
            onChange={(event) => model.setNextMechanic(event.target.value)}
            disabled={model.isBusy}
            className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
            aria-label={t("pages.orders.operations.mechanic") as string}
          >
            {model.availableMechanics.map((mechanic) => (
              <option key={mechanic} value={mechanic}>
                {mechanic}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-3 py-2 text-xs text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={model.handleAssignMechanic}
          disabled={!model.isMechanicDirty || model.isBusy}
        >
          {model.assignMechanicMutation.isPending
            ? t("pages.orders.operations.actions.mechanicPending")
            : t("pages.orders.operations.actions.mechanic")}
        </button>
      </div>

      <button
        type="button"
        className="cursor-pointer rounded-[10px] border border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.14)] px-3 py-2 text-xs text-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={model.handleFlagToggle}
        disabled={model.isBusy}
      >
        {model.setFlagMutation.isPending
          ? t("pages.orders.operations.actions.flagPending")
          : flagged
            ? t("pages.orders.operations.actions.unflag")
            : t("pages.orders.operations.actions.flag")}
      </button>

      {model.errorMessage ? <p className="m-0 text-xs text-[#fecaca]">{model.errorMessage}</p> : null}
      {model.successMessage ? <p className="m-0 text-xs text-emerald-300">{model.successMessage}</p> : null}
    </div>
  );
};
