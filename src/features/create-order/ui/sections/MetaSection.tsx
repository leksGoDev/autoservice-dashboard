import { ORDER_PRIORITIES, ORDER_STATUSES } from "@/entities/order/model/options";
import type { CreateOrderFormHandle } from "@/features/create-order/model/use-create-order-form-model";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { errorTextClassName, fieldLabelClassName, fieldTitleClassName, inputClassName } from "./form-styles";

type MetaSectionProps = {
  form: CreateOrderFormHandle;
  mechanics: string[];
};

export const MetaSection = ({ form, mechanics }: MetaSectionProps) => {
  const { t } = useI18n();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <WidgetCard title={t("pages.ordersCreate.sections.meta")}> 
      <div className="grid gap-3 md:grid-cols-3">
        <label className={fieldLabelClassName}>
          <span className={fieldTitleClassName}>{t("pages.ordersCreate.meta.priority")}</span>
          <select className={inputClassName} {...register("priority")}>
            {ORDER_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {t(`order.priority.${priority}`)}
              </option>
            ))}
          </select>
        </label>

        <label className={fieldLabelClassName}>
          <span className={fieldTitleClassName}>{t("pages.ordersCreate.meta.status")}</span>
          <select className={inputClassName} {...register("status")}>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`order.status.${status}`)}
              </option>
            ))}
          </select>
        </label>

        <label className={fieldLabelClassName}>
          <span className={fieldTitleClassName}>{t("pages.ordersCreate.meta.mechanic")}</span>
          <select className={inputClassName} {...register("assignedMechanic")}>
            <option value="">{t("pages.ordersCreate.common.selectPlaceholder")}</option>
            {mechanics.map((mechanic) => (
              <option key={mechanic} value={mechanic}>
                {mechanic}
              </option>
            ))}
          </select>
          {errors.assignedMechanic ? <span className={errorTextClassName}>{errors.assignedMechanic.message}</span> : null}
        </label>
      </div>
    </WidgetCard>
  );
};
