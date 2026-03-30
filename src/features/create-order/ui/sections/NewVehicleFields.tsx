import type { CreateOrderFormHandle } from "@/features/create-order/model/use-create-order-form";
import { useI18n } from "@/shared/i18n/use-i18n";
import { errorTextClassName, fieldLabelClassName, fieldTitleClassName, inputClassName } from "./form-styles";

type NewVehicleFieldsProps = {
  register: CreateOrderFormHandle["register"];
  errors: CreateOrderFormHandle["formState"]["errors"];
};

export const NewVehicleFields = ({ register, errors }: NewVehicleFieldsProps) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className={fieldLabelClassName}>
        <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.vin")}</span>
        <input className={inputClassName} {...register("newVehicleVin")} />
        {errors.newVehicleVin ? <span className={errorTextClassName}>{errors.newVehicleVin.message}</span> : null}
      </label>
      <label className={fieldLabelClassName}>
        <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.plate")}</span>
        <input className={inputClassName} {...register("newVehiclePlateNumber")} />
        {errors.newVehiclePlateNumber ? <span className={errorTextClassName}>{errors.newVehiclePlateNumber.message}</span> : null}
      </label>
      <label className={fieldLabelClassName}>
        <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.make")}</span>
        <input className={inputClassName} {...register("newVehicleMake")} />
        {errors.newVehicleMake ? <span className={errorTextClassName}>{errors.newVehicleMake.message}</span> : null}
      </label>
      <label className={fieldLabelClassName}>
        <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.model")}</span>
        <input className={inputClassName} {...register("newVehicleModel")} />
        {errors.newVehicleModel ? <span className={errorTextClassName}>{errors.newVehicleModel.message}</span> : null}
      </label>
      <label className={fieldLabelClassName}>
        <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.year")}</span>
        <input className={inputClassName} type="number" {...register("newVehicleYear", { valueAsNumber: true })} />
        {errors.newVehicleYear ? <span className={errorTextClassName}>{errors.newVehicleYear.message}</span> : null}
      </label>
    </div>
  );
};
