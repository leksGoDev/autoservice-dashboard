import type { OrderServiceJob, ServiceJobStatus } from "@/entities/order/model/types";
import { formatOrderCurrency } from "@/entities/order/model/presentation";
import type { ServiceJobsControlsModel } from "../../model/use-service-jobs-controls-model";
import { useI18n } from "@/shared/i18n/use-i18n";
import { getStatusBadgeClass } from "@/shared/ui/status-badges";
import { formatOrderHours, getJobStatusBadgeModifier } from "@/widgets/orders/details/model/presentation";

const SERVICE_JOB_STATUSES: ServiceJobStatus[] = ["pending", "in_progress", "waiting_parts", "completed"];

type JobsTableProps = {
  jobs: OrderServiceJob[];
  model: ServiceJobsControlsModel;
};

export const JobsTable = ({ jobs, model }: JobsTableProps) => {
  const { t } = useI18n();

  return (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[1020px] border-collapse text-left text-[13px]">
      <thead>
        <tr>
          <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orderDetails.jobs.headers.name")}
          </th>
          <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orderDetails.jobs.headers.category")}
          </th>
          <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orderDetails.jobs.headers.status")}
          </th>
          <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orderDetails.jobs.headers.mechanic")}
          </th>
          <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orderDetails.jobs.headers.estimated")}
          </th>
          <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orderDetails.jobs.headers.actual")}
          </th>
          <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orderDetails.jobs.headers.labor")}
          </th>
          <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.orderDetails.controls.jobs.headers.actions")}
          </th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => {
          const selectedStatus = model.jobStatuses[job.id] ?? job.status;
          const selectedMechanic = model.jobMechanics[job.id] ?? job.assignedMechanic;

          return (
            <tr key={job.id} className="transition-colors hover:bg-[#20283a]">
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
                      onChange={(event) =>
                        model.setJobStatuses((prev) => ({
                          ...prev,
                          [job.id]: event.target.value as ServiceJobStatus,
                        }))
                      }
                      disabled={model.isBusy}
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
                      onClick={() => model.handleUpdateJobStatus(job.id)}
                      disabled={model.isBusy || selectedStatus === job.status}
                    >
                      {model.updateJobStatusMutation.isPending
                        ? t("pages.orderDetails.controls.jobs.actions.statusPending")
                        : t("pages.orderDetails.controls.jobs.actions.status")}
                    </button>
                  </div>

                  <div className="grid gap-1 sm:grid-cols-[1fr_auto]">
                    <select
                      value={selectedMechanic}
                      onChange={(event) =>
                        model.setJobMechanics((prev) => ({
                          ...prev,
                          [job.id]: event.target.value,
                        }))
                      }
                      disabled={model.isBusy}
                      aria-label={`${t("pages.orderDetails.controls.jobs.row.mechanic")} ${job.name}`}
                      className="rounded-[8px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
                    >
                      {model.availableMechanics.map((mechanic) => (
                        <option key={mechanic} value={mechanic}>
                          {mechanic}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="cursor-pointer rounded-[8px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-2 py-1.5 text-xs text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => model.handleAssignJobMechanic(job.id)}
                      disabled={model.isBusy || selectedMechanic === job.assignedMechanic}
                    >
                      {model.assignJobMechanicMutation.isPending
                        ? t("pages.orderDetails.controls.jobs.actions.mechanicPending")
                        : t("pages.orderDetails.controls.jobs.actions.mechanic")}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  );
};
