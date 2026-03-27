import type { CreateOrderFormInput } from "@/features/create-order/model/schema";
import type { CreateOrderFormHandle } from "@/features/create-order/model/use-create-order-form-model";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import type { FieldArrayWithId, UseFieldArrayReturn } from "react-hook-form";
import { errorTextClassName, fieldLabelClassName, fieldTitleClassName, inputClassName } from "./form-styles";

type InitialJobsSectionProps = {
  form: CreateOrderFormHandle;
  mechanics: string[];
  jobsFieldArray: UseFieldArrayReturn<CreateOrderFormInput, "initialJobs", "id">;
};

function renderJobFields(
  field: FieldArrayWithId<CreateOrderFormInput, "initialJobs", "id">,
  index: number,
  form: CreateOrderFormHandle,
  mechanics: string[],
  onRemove: (index: number) => void,
  canRemove: boolean,
  t: (key: string) => string,
) {
  const {
    register,
    formState: { errors },
  } = form;

  const jobErrors = errors.initialJobs?.[index];

  return (
    <div key={field.id} className="rounded-xl border border-[var(--color-border)] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <strong className="text-sm">{t("pages.ordersCreate.jobs.job")} #{index + 1}</strong>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className="cursor-pointer rounded-[10px] border border-[rgba(255,133,133,0.35)] bg-[rgba(255,133,133,0.14)] px-2.5 py-1.5 text-xs"
        >
          {t("pages.ordersCreate.jobs.remove")}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className={fieldLabelClassName}>
          <span className={fieldTitleClassName}>{t("pages.ordersCreate.jobs.name")}</span>
          <input className={inputClassName} {...register(`initialJobs.${index}.name`)} />
          {jobErrors?.name ? <span className={errorTextClassName}>{jobErrors.name.message}</span> : null}
        </label>

        <label className={fieldLabelClassName}>
          <span className={fieldTitleClassName}>{t("pages.ordersCreate.jobs.category")}</span>
          <input className={inputClassName} {...register(`initialJobs.${index}.category`)} />
          {jobErrors?.category ? <span className={errorTextClassName}>{jobErrors.category.message}</span> : null}
        </label>

        <label className={fieldLabelClassName}>
          <span className={fieldTitleClassName}>{t("pages.ordersCreate.jobs.estimatedHours")}</span>
          <input className={inputClassName} type="number" step="0.1" {...register(`initialJobs.${index}.estimatedHours`, { valueAsNumber: true })} />
          {jobErrors?.estimatedHours ? <span className={errorTextClassName}>{jobErrors.estimatedHours.message}</span> : null}
        </label>

        <label className={fieldLabelClassName}>
          <span className={fieldTitleClassName}>{t("pages.ordersCreate.jobs.laborPrice")}</span>
          <input className={inputClassName} type="number" step="0.01" {...register(`initialJobs.${index}.laborPrice`, { valueAsNumber: true })} />
          {jobErrors?.laborPrice ? <span className={errorTextClassName}>{jobErrors.laborPrice.message}</span> : null}
        </label>

        <label className={fieldLabelClassName}>
          <span className={fieldTitleClassName}>{t("pages.ordersCreate.jobs.mechanic")}</span>
          <select className={inputClassName} {...register(`initialJobs.${index}.assignedMechanic`)}>
            <option value="">{t("pages.ordersCreate.common.selectPlaceholder")}</option>
            {mechanics.map((mechanic) => (
              <option key={mechanic} value={mechanic}>
                {mechanic}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export const InitialJobsSection = ({ form, jobsFieldArray, mechanics }: InitialJobsSectionProps) => {
  const { t } = useI18n();

  return (
    <WidgetCard title={t("pages.ordersCreate.sections.jobs")}>
      <div className="grid gap-3">
        {jobsFieldArray.fields.map((field, index) =>
          renderJobFields(field, index, form, mechanics, jobsFieldArray.remove, jobsFieldArray.fields.length > 1, t),
        )}

        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.14)] px-3 py-2 text-sm"
          onClick={() =>
            jobsFieldArray.append({
              name: "",
              category: "",
              estimatedHours: 1,
              laborPrice: 100,
              assignedMechanic: "",
            })
          }
        >
          {t("pages.ordersCreate.jobs.add")}
        </button>

        {form.formState.errors.initialJobs?.message ? (
          <span className={errorTextClassName}>{form.formState.errors.initialJobs.message}</span>
        ) : null}
      </div>
    </WidgetCard>
  );
};
