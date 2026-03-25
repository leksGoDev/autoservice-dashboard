import type { ServiceJobsControlsModel } from "../../model/use-service-jobs-controls-model";
import { useI18n } from "@/shared/i18n/use-i18n";

type JobsCreateFormProps = {
  model: ServiceJobsControlsModel;
};

export const JobsCreateForm = ({ model }: JobsCreateFormProps) => {
  const { t } = useI18n();

  return (
  <div className="grid gap-2 rounded-xl border border-[rgba(154,164,178,0.12)] bg-[rgba(15,17,21,0.38)] p-3 sm:grid-cols-2 xl:grid-cols-6">
    <label className="grid gap-1">
      <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
        {t("pages.orderDetails.controls.jobs.add.name")}
      </span>
      <input
        value={model.jobName}
        onChange={(event) => model.setJobName(event.target.value)}
        disabled={model.isBusy}
        className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
        aria-label={t("pages.orderDetails.controls.jobs.add.name")}
      />
    </label>

    <label className="grid gap-1">
      <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
        {t("pages.orderDetails.controls.jobs.add.category")}
      </span>
      <input
        value={model.jobCategory}
        onChange={(event) => model.setJobCategory(event.target.value)}
        disabled={model.isBusy}
        className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
        aria-label={t("pages.orderDetails.controls.jobs.add.category")}
      />
    </label>

    <label className="grid gap-1">
      <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
        {t("pages.orderDetails.controls.jobs.add.estimated")}
      </span>
      <input
        type="number"
        min="0.1"
        step="0.1"
        value={model.jobEstimatedHours}
        onChange={(event) => model.setJobEstimatedHours(event.target.value)}
        disabled={model.isBusy}
        className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
        aria-label={t("pages.orderDetails.controls.jobs.add.estimated")}
      />
    </label>

    <label className="grid gap-1">
      <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
        {t("pages.orderDetails.controls.jobs.add.labor")}
      </span>
      <input
        type="number"
        min="1"
        step="1"
        value={model.jobLaborPrice}
        onChange={(event) => model.setJobLaborPrice(event.target.value)}
        disabled={model.isBusy}
        className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
        aria-label={t("pages.orderDetails.controls.jobs.add.labor")}
      />
    </label>

    <label className="grid gap-1">
      <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
        {t("pages.orderDetails.controls.jobs.add.mechanic")}
      </span>
      <select
        value={model.jobMechanic}
        onChange={(event) => model.setJobMechanic(event.target.value)}
        disabled={model.isBusy}
        className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
        aria-label={t("pages.orderDetails.controls.jobs.add.mechanic")}
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
      className="mt-auto cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-3 py-2 text-xs text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
      onClick={model.handleAddJob}
      disabled={model.isBusy}
    >
      {model.addJobMutation.isPending
        ? t("pages.orderDetails.controls.jobs.actions.addPending")
        : t("pages.orderDetails.controls.jobs.actions.add")}
    </button>
  </div>
  );
};
