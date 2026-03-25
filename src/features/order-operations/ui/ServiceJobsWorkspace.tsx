import type { OrderServiceJob } from "@/entities/order/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useServiceJobsControlsModel } from "../model/use-service-jobs-controls-model";
import { JobsCreateForm } from "./jobs/JobsCreateForm";
import { JobsTable } from "./jobs/JobsTable";

type ServiceJobsWorkspaceProps = {
  orderId: string;
  jobs: OrderServiceJob[];
  mechanics: string[];
};

export const ServiceJobsWorkspace = ({ orderId, jobs, mechanics }: ServiceJobsWorkspaceProps) => {
  const { t } = useI18n();
  const model = useServiceJobsControlsModel({
    orderId,
    jobs,
    mechanics,
  });

  return (
    <div className="grid gap-4">
      <JobsCreateForm
        model={model}
      />

      <JobsTable
        jobs={jobs}
        model={model}
      />

      {jobs.length === 0 ? (
        <p className="m-0 text-sm text-[var(--color-text-secondary)]">{t("pages.orderDetails.states.emptyJobs")}</p>
      ) : null}
      {model.errorMessage ? <p className="m-0 text-xs text-[#fecaca]">{model.errorMessage}</p> : null}
      {model.successMessage ? <p className="m-0 text-xs text-emerald-300">{model.successMessage}</p> : null}
    </div>
  );
};
