import { useCallback } from "react";

import type { OrderServiceJob, ServiceJobStatus } from "@/entities/order/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import type { ServiceJobsControlsModel } from "../../model/use-service-jobs-controls-model";
import { JobsTableRow } from "./JobsTableRow";

type JobsTableProps = {
  jobs: OrderServiceJob[];
  model: ServiceJobsControlsModel;
};

export const JobsTable = ({ jobs, model }: JobsTableProps) => {
  const { t } = useI18n();

  const handleStatusChange = useCallback(
    (jobId: string, status: ServiceJobStatus) => {
      model.setJobStatuses((prev) => ({
        ...prev,
        [jobId]: status,
      }));
    },
    [model.setJobStatuses],
  );

  const handleMechanicChange = useCallback(
    (jobId: string, mechanic: string) => {
      model.setJobMechanics((prev) => ({
        ...prev,
        [jobId]: mechanic,
      }));
    },
    [model.setJobMechanics],
  );

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
          {jobs.map((job) => (
            <JobsTableRow
              key={job.id}
              job={job}
              selectedStatus={model.jobStatuses[job.id] ?? job.status}
              selectedMechanic={model.jobMechanics[job.id] ?? job.assignedMechanic}
              availableMechanics={model.availableMechanics}
              isBusy={model.isBusy}
              isUpdateStatusPending={model.updateJobStatusMutation.isPending}
              isAssignMechanicPending={model.assignJobMechanicMutation.isPending}
              onStatusChange={handleStatusChange}
              onMechanicChange={handleMechanicChange}
              onUpdateJobStatus={model.handleUpdateJobStatus}
              onAssignJobMechanic={model.handleAssignJobMechanic}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
