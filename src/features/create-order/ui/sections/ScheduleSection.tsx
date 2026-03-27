import type { CreateOrderFormHandle } from "@/features/create-order/model/use-create-order-form-model";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { errorTextClassName, fieldLabelClassName, fieldTitleClassName, inputClassName } from "./form-styles";

type ScheduleSectionProps = {
  form: CreateOrderFormHandle;
};

export const ScheduleSection = ({ form }: ScheduleSectionProps) => {
  const { t } = useI18n();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <WidgetCard title={t("pages.ordersCreate.sections.schedule")}> 
      <div className="grid gap-3 md:grid-cols-2">
        <label className={fieldLabelClassName}>
          <span className={fieldTitleClassName}>{t("pages.ordersCreate.schedule.scheduledFor")}</span>
          <input type="datetime-local" className={inputClassName} {...register("scheduledFor")} />
          {errors.scheduledFor ? <span className={errorTextClassName}>{errors.scheduledFor.message}</span> : null}
        </label>

        <label className={fieldLabelClassName}>
          <span className={fieldTitleClassName}>{t("pages.ordersCreate.schedule.complaint")}</span>
          <textarea rows={3} className={inputClassName} {...register("complaint")} />
          {errors.complaint ? <span className={errorTextClassName}>{errors.complaint.message}</span> : null}
        </label>
      </div>

      <label className={`${fieldLabelClassName} mt-3`}>
        <span className={fieldTitleClassName}>{t("pages.ordersCreate.schedule.notes")}</span>
        <textarea rows={3} className={inputClassName} {...register("notes")} />
      </label>
    </WidgetCard>
  );
};
