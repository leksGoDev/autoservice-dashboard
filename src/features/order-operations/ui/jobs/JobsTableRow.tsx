import { memo } from "react";

import type { OrderServiceJob, ServiceJobStatus } from "@/entities/order/model/types";
import { SERVICE_JOB_STATUSES } from "@/entities/order/model/options";
import { formatOrderCurrency } from "@/entities/order/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { denseConfirmButtonClassName, denseControlInputClassName, tableBodyCellClassName } from "@/shared/ui/class-names";
import { getStatusBadgeClass } from "@/shared/ui/status-badges";
import { formatOrderHours, getJobStatusBadgeModifier } from "@/widgets/orders/details/model/presentation";

export type JobsTableRowProps = {
  job: OrderServiceJob;
  selectedStatus: ServiceJobStatus;
  selectedMechanic: string;
  availableMechanics: string[];
  isBusy: boolean;
  isUpdateStatusPending: boolean;
  isAssignMechanicPending: boolean;
  onStatusChange: (jobId: string, status: ServiceJobStatus) => void;
  onMechanicChange: (jobId: string, mechanic: string) => void;
  onUpdateJobStatus: (jobId: string, status: ServiceJobStatus) => void;
  onAssignJobMechanic: (jobId: string, mechanic: string) => void;
};

export const JobsTableRow = memo(
  ({
    job,
    selectedStatus,
    selectedMechanic,
    availableMechanics,
    isBusy,
    isUpdateStatusPending,
    isAssignMechanicPending,
    onStatusChange,
    onMechanicChange,
    onUpdateJobStatus,
    onAssignJobMechanic,
  }: JobsTableRowProps) => {
    const { t } = useI18n();

    return (
      <tr className="transition-colors hover:bg-[#20283a]">
        <td className={tableBodyCellClassName}>{job.name}</td>
        <td className={`${tableBodyCellClassName} text-[var(--color-text-secondary)]`}>
          {job.category}
        </td>
        <td className={tableBodyCellClassName}>
          <span
            className={[
              "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
              getStatusBadgeClass(getJobStatusBadgeModifier(job.status)),
            ].join(" ").trim()}
          >
            {t(`pages.orderDetails.jobs.status.${job.status}`)}
          </span>
        </td>
        <td className={tableBodyCellClassName}>{job.assignedMechanic}</td>
        <td className={tableBodyCellClassName}>{formatOrderHours(job.estimatedHours)}</td>
        <td className={tableBodyCellClassName}>{formatOrderHours(job.actualHours)}</td>
        <td className={tableBodyCellClassName}>{formatOrderCurrency(job.laborPrice)}</td>
        <td className={tableBodyCellClassName}>
          <div className="grid gap-2">
            <div className="grid gap-1 sm:grid-cols-[1fr_auto]">
              <select
                value={selectedStatus}
                onChange={(event) => onStatusChange(job.id, event.target.value as ServiceJobStatus)}
                disabled={isBusy}
                aria-label={`${t("pages.orderDetails.controls.jobs.row.status")} ${job.name}`}
                className={denseControlInputClassName}
              >
                {SERVICE_JOB_STATUSES.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {t(`pages.orderDetails.jobs.status.${statusOption}`)}
                  </option>
                ))}
              </select>

              {selectedStatus !== job.status ? (
                <button
                  type="button"
                  className={denseConfirmButtonClassName}
                  onClick={() => onUpdateJobStatus(job.id, selectedStatus)}
                  disabled={isBusy}
                  aria-label={
                    isUpdateStatusPending
                      ? String(t("pages.orderDetails.controls.jobs.actions.statusPending"))
                      : String(t("pages.orderDetails.controls.jobs.actions.status"))
                  }
                  title={
                    isUpdateStatusPending
                      ? String(t("pages.orderDetails.controls.jobs.actions.statusPending"))
                      : String(t("pages.orderDetails.controls.jobs.actions.status"))
                  }
                >
                  <span aria-hidden="true">✓</span>
                </button>
              ) : null}
            </div>

            <div className="grid gap-1 sm:grid-cols-[1fr_auto]">
              <select
                value={selectedMechanic}
                onChange={(event) => onMechanicChange(job.id, event.target.value)}
                disabled={isBusy}
                aria-label={`${t("pages.orderDetails.controls.jobs.row.mechanic")} ${job.name}`}
                className={denseControlInputClassName}
              >
                {availableMechanics.map((mechanic) => (
                  <option key={mechanic} value={mechanic}>
                    {mechanic}
                  </option>
                ))}
              </select>

              {selectedMechanic !== job.assignedMechanic ? (
                <button
                  type="button"
                  className={denseConfirmButtonClassName}
                  onClick={() => onAssignJobMechanic(job.id, selectedMechanic)}
                  disabled={isBusy}
                  aria-label={
                    isAssignMechanicPending
                      ? String(t("pages.orderDetails.controls.jobs.actions.mechanicPending"))
                      : String(t("pages.orderDetails.controls.jobs.actions.mechanic"))
                  }
                  title={
                    isAssignMechanicPending
                      ? String(t("pages.orderDetails.controls.jobs.actions.mechanicPending"))
                      : String(t("pages.orderDetails.controls.jobs.actions.mechanic"))
                  }
                >
                  <span aria-hidden="true">✓</span>
                </button>
              ) : null}
            </div>
          </div>
        </td>
      </tr>
    );
  },
);

JobsTableRow.displayName = "JobsTableRow";
