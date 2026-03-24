import type { OrderServiceJob } from "@/entities/order/model/types";
import { formatOrderCurrency } from "@/entities/order/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { getStatusBadgeClass } from "@/shared/ui/status-badges";
import { formatOrderHours, getJobStatusBadgeModifier } from "../model/presentation";

type OrderDetailsJobsTableProps = {
  jobs: OrderServiceJob[];
};

export const OrderDetailsJobsTable = ({ jobs }: OrderDetailsJobsTableProps) => {
  const { t } = useI18n();

  if (jobs.length === 0) {
    return <p className="m-0 text-sm text-[var(--color-text-secondary)]">{t("pages.orderDetails.states.emptyJobs")}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
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
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
