import type { ServiceJobsControlsModel } from "../../model/use-service-jobs-model";
import { useI18n } from "@/shared/i18n/use-i18n";

type JobsCreateFormProps = {
  model: ServiceJobsControlsModel;
};

export const JobsCreateForm = ({ model }: JobsCreateFormProps) => {
  const { t } = useI18n();
  const formControlClassName =
    "h-9 rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 text-sm leading-5 text-[var(--color-text-primary)]";
  const actionButtonClassName =
    "inline-flex h-10 items-center justify-center cursor-pointer whitespace-nowrap rounded-[10px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-4 text-sm leading-5 font-semibold text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="grid gap-2 rounded-xl border border-[rgba(154,164,178,0.12)] bg-[rgba(15,17,21,0.38)] p-3 sm:grid-cols-2 xl:grid-cols-6">
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          {t("pages.orderDetails.controls.jobs.add.name")}
        </span>
        <input
          value={model.jobName}
          onChange={(event) => model.setJobName(event.target.value)}
          disabled={model.isBusy}
          className={formControlClassName}
          aria-label={t("pages.orderDetails.controls.jobs.add.name")}
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          {t("pages.orderDetails.controls.jobs.add.category")}
        </span>
        <input
          value={model.jobCategory}
          onChange={(event) => model.setJobCategory(event.target.value)}
          disabled={model.isBusy}
          className={formControlClassName}
          aria-label={t("pages.orderDetails.controls.jobs.add.category")}
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          {t("pages.orderDetails.controls.jobs.add.estimated")}
        </span>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={model.jobEstimatedHours}
          onChange={(event) => model.setJobEstimatedHours(event.target.value)}
          disabled={model.isBusy}
          className={formControlClassName}
          aria-label={t("pages.orderDetails.controls.jobs.add.estimated")}
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          {t("pages.orderDetails.controls.jobs.add.labor")}
        </span>
        <input
          type="number"
          min="1"
          step="1"
          value={model.jobLaborPrice}
          onChange={(event) => model.setJobLaborPrice(event.target.value)}
          disabled={model.isBusy}
          className={formControlClassName}
          aria-label={t("pages.orderDetails.controls.jobs.add.labor")}
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          {t("pages.orderDetails.controls.jobs.add.mechanic")}
        </span>
        <select
          value={model.jobMechanic}
          onChange={(event) => model.setJobMechanic(event.target.value)}
          disabled={model.isBusy}
          className={formControlClassName}
          aria-label={t("pages.orderDetails.controls.jobs.add.mechanic")}
        >
          {model.availableMechanics.map((mechanic) => (
            <option key={mechanic} value={mechanic}>
              {mechanic}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-1">
        <span className="select-none text-xs leading-[18px] opacity-0" aria-hidden>
          .
        </span>
        <button
          type="button"
          className={`${actionButtonClassName} justify-self-start`}
          onClick={model.handleAddJob}
          disabled={model.isBusy || !model.canAddJob}
        >
          {model.addJobMutation.isPending
            ? t("pages.orderDetails.controls.jobs.actions.addPending")
            : t("pages.orderDetails.controls.jobs.actions.add")}
        </button>
      </div>
    </div>
  );
};
