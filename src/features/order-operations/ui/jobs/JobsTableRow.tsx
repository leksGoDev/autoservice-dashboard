import { memo } from "react";

import type { OrderServiceJob, ServiceJobStatus } from "@/entities/order/model/types";
import { SERVICE_JOB_STATUSES } from "@/entities/order/model/options";
import { formatOrderCurrency } from "@/entities/order/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
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
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{job.name}</td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle text-[var(--color-text-secondary)]">
          {job.category}
        </td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
          <span
            className={[
              "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
              getStatusBadgeClass(getJobStatusBadgeModifier(job.status)),
            ].join(" ").trim()}
          >
            {t(`pages.orderDetails.jobs.status.${job.status}`)}
          </span>
        </td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{job.assignedMechanic}</td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{formatOrderHours(job.estimatedHours)}</td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{formatOrderHours(job.actualHours)}</td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{formatOrderCurrency(job.laborPrice)}</td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
          <div className="grid gap-2">
            <div className="grid gap-1 sm:grid-cols-[1fr_auto]">
              <select
                value={selectedStatus}
                onChange={(event) => onStatusChange(job.id, event.target.value as ServiceJobStatus)}
                disabled={isBusy}
                aria-label={`${t("pages.orderDetails.controls.jobs.row.status")} ${job.name}`}
                className="rounded-[8px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
              >
                {SERVICE_JOB_STATUSES.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {t(`pages.orderDetails.jobs.status.${statusOption}`)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="cursor-pointer rounded-[8px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-2 py-1.5 text-xs text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => onUpdateJobStatus(job.id, selectedStatus)}
                disabled={isBusy || selectedStatus === job.status}
              >
                {isUpdateStatusPending
                  ? t("pages.orderDetails.controls.jobs.actions.statusPending")
                  : t("pages.orderDetails.controls.jobs.actions.status")}
              </button>
            </div>

            <div className="grid gap-1 sm:grid-cols-[1fr_auto]">
              <select
                value={selectedMechanic}
                onChange={(event) => onMechanicChange(job.id, event.target.value)}
                disabled={isBusy}
                aria-label={`${t("pages.orderDetails.controls.jobs.row.mechanic")} ${job.name}`}
                className="rounded-[8px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
              >
                {availableMechanics.map((mechanic) => (
                  <option key={mechanic} value={mechanic}>
                    {mechanic}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="cursor-pointer rounded-[8px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-2 py-1.5 text-xs text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => onAssignJobMechanic(job.id, selectedMechanic)}
                disabled={isBusy || selectedMechanic === job.assignedMechanic}
              >
                {isAssignMechanicPending
                  ? t("pages.orderDetails.controls.jobs.actions.mechanicPending")
                  : t("pages.orderDetails.controls.jobs.actions.mechanic")}
              </button>
            </div>
          </div>
        </td>
      </tr>
    );
  },
);

JobsTableRow.displayName = "JobsTableRow";
